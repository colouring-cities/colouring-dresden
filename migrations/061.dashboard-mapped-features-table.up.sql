-- THIS SQL FILE CONTAINS ALL RELEVANT DATABASE STEPS IN SQL, WHICH ARE REQUIRED TO SETUP THE DASHBOARD
-- THE DASHBOARD SHOWS THE SPATIO-TEMPORAL MAPPING ACITIVITIES WITHIN THE COLOURING CITIES INSTANCE

-- THIS FILE 

DROP TABLE IF EXISTS public.mapped_features;

CREATE TABLE public.mapped_features 
(
    mapped_feature_id BIGSERIAL PRIMARY KEY,
    log_id BIGINT NOT NULL,
    log_timestamp TIMESTAMPTZ,
    feature VARCHAR,
    forward_value VARCHAR,
    reverse_value VARCHAR,
    edit_type VARCHAR,
    user_id UUID,
    building_id INT4
);

WITH data1_extracted AS (
	SELECT 
		log_id,
		log_timestamp,
		user_id,
		building_id,
		json_each_text.key AS feature,
		json_each_text.value AS value1,
		ROW_NUMBER() OVER (PARTITION BY log_id ORDER BY	json_each_text.key) AS rn
	FROM 
		public.logs,
		LATERAL json_each_text(forward_patch::JSON)
),
data2_extracted AS (
	SELECT
		log_id,
		json_each_text.value AS value2,
		ROW_NUMBER() OVER (PARTITION BY log_id ORDER BY json_each_text.key) AS rn
	FROM 
		public.logs,
		LATERAL json_each_text(reverse_patch::JSON)
)
INSERT INTO public.mapped_features (log_id, feature, log_timestamp, user_id, building_id, forward_value, reverse_value)
SELECT
	d1.log_id,
	d1.feature,
	d1.log_timestamp,
	d1.user_id,
	d1.building_id,
	d1.value1 AS "forward_value",
	d2.value2 AS "reverse_value"
FROM data1_extracted d1
JOIN data2_extracted d2 ON d1."log_id" = d2."log_id" AND d1.rn = d2.rn
ORDER BY d1."log_id", d1.rn;

ALTER TABLE public.mapped_features ADD CONSTRAINT log_id_fkey FOREIGN KEY (log_id) REFERENCES public.logs(log_id);

UPDATE public.mapped_features
SET "edit_type" = CASE
	WHEN "forward_value" NOT LIKE '%{%}%' AND "reverse_value" IS 
	NULL AND "forward_value" IS NOT NULL THEN 'added'
	WHEN "reverse_value" NOT LIKE '%{%}%' AND "reverse_value" IS NOT 
	NULL AND "forward_value" IS NULL THEN 'removed'
	WHEN "reverse_value" NOT LIKE '%{%}%' AND "forward_value" NOT 
	LIKE '%{%}%' AND "reverse_value" IS NOT NULL AND "forward_value" IS 
	NOT NULL THEN 'modified'
	
WHEN "reverse_value" LIKE '{%}' AND "forward_value" LIKE '{%}' 
		AND (SELECT COUNT(*) FROM jsonb_object_keys("forward_value"::jsonb)) > (SELECT COUNT(*) FROM jsonb_object_keys("reverse_value"::jsonb)) 
		THEN 'added'
	WHEN "reverse_value" IS NULL AND "forward_value" LIKE '{%}' 
		THEN 'added'
	WHEN "reverse_value" LIKE '{%}' AND "forward_value" LIKE '{%}' 
		AND (SELECT COUNT(*) FROM jsonb_object_keys("forward_value"::jsonb)) < (SELECT COUNT(*) FROM jsonb_object_keys("reverse_value"::jsonb)) 
		THEN 'removed'
	WHEN "reverse_value" LIKE '{%}' AND "forward_value" IS NULL 
		THEN 'removed'
	WHEN "reverse_value" LIKE '{%}' AND "forward_value" LIKE '{%}' 
		AND (SELECT COUNT(*) FROM jsonb_object_keys("forward_value"::jsonb)) = (SELECT COUNT(*) FROM jsonb_object_keys("reverse_value"::jsonb)) 
		THEN 'modified'

WHEN "reverse_value" LIKE '[%]' AND "forward_value" LIKE '[%]' 
		AND (SELECT COUNT(*) FROM jsonb_array_length("forward_value"::jsonb)) > (SELECT COUNT(*) FROM jsonb_array_length("reverse_value"::jsonb))
		THEN 'added'
	WHEN "reverse_value" IS NULL AND "forward_value" LIKE '[%]' 
		THEN 'added'
	WHEN "reverse_value" LIKE '[%]' AND "forward_value" LIKE '[%]' 
		AND (SELECT COUNT(*) FROM jsonb_array_length("forward_value"::jsonb)) < (SELECT COUNT(*) FROM jsonb_array_length("reverse_value"::jsonb))
		THEN 'removed'
	WHEN "reverse_value" LIKE '[%]' AND "forward_value" IS NULL 
		THEN 'removed'
	WHEN "reverse_value" LIKE '[%]' AND "forward_value" LIKE '[%]' 
		AND (SELECT COUNT(*) FROM jsonb_array_length("forward_value"::jsonb)) = (SELECT COUNT(*) FROM jsonb_array_length("reverse_value"::jsonb))
		THEN 'modified'
	ELSE "edit_type" -- retain the original value if no conditions match
END;

CREATE INDEX mapped_features_log_id_idx ON mapped_features (log_id);

CREATE INDEX mapped_features_log_timestamp_idx ON mapped_features (log_timestamp);

CREATE INDEX mapped_features_user_idx ON mapped_features (user_id);

CREATE INDEX mapped_features_building_idx ON mapped_features (building_id);

CREATE INDEX mapped_features_log_id_edit_type_idx ON public.mapped_features(log_id, edit_type);		-- verbessert Performance bei Statement zur Ausgabe der letzten Edits ein wenig

CREATE INDEX mapped_features_building_feature_idx ON public.mapped_features(building_id, feature);		-- verbessert Performance zum Ermitteln der letzten Merkmalsänderung pro Gebäude ein wenig