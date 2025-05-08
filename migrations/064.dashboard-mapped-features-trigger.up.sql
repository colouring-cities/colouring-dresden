-- THIS SQL FILE CONTAINS ALL RELEVANT DATABASE STEPS IN SQL, WHICH ARE REQUIRED TO SETUP THE DASHBOARD
-- THE DASHBOARD SHOWS THE SPATIO-TEMPORAL MAPPING ACITIVITIES WITHIN THE COLOURING CITIES INSTANCE

-- THIS FILE IS CUSTOMIZED FOR DRESDEN, GERMANY. PLEASE REPLACE SOME DATA (E.G. GEOMETRIES OF CITY DISTICTS) WITH THE PROPER DATASET FOR YOUR CHOSEN CITY

CREATE OR REPLACE FUNCTION update_mapped_features_on_trigger()
RETURNS TRIGGER AS $$
BEGIN
    WITH data1_extracted AS (
        SELECT 
            NEW.log_id AS log_id,
			NEW.log_timestamp AS log_timestamp,
			NEW.user_id AS user_id,
			NEW.building_id AS building_id,
            json_each_text.key AS feature,
            json_each_text.value AS value1,
            ROW_NUMBER() OVER (PARTITION BY NEW.log_id ORDER BY json_each_text.key) AS rn
        FROM 
            LATERAL json_each_text(NEW.forward_patch::JSON)
    ),
    data2_extracted AS (
        SELECT
            NEW.log_id AS log_id,
            json_each_text.value AS value2,
            ROW_NUMBER() OVER (PARTITION BY NEW.log_id ORDER BY json_each_text.key) AS rn
        FROM 
            LATERAL json_each_text(NEW.reverse_patch::JSON)
    )
    INSERT INTO public.mapped_features (log_id, feature, log_timestamp, user_id, building_id, forward_value, reverse_value, edit_type)
    SELECT
        d1.log_id,
        d1.feature,
		d1.log_timestamp,
		d1.user_id,
		d1.building_id,
        d1.value1 AS forward_value,
        d2.value2 AS reverse_value,
        CASE
            WHEN d1.value1 NOT LIKE '%{%}%' AND d2.value2 IS NULL AND d1.value1 IS NOT NULL THEN 'added'
            WHEN d2.value2 NOT LIKE '%{%}%' AND d2.value2 IS NOT NULL AND d1.value1 IS NULL THEN 'removed'
            WHEN d2.value2 NOT LIKE '%{%}%' AND d1.value1 NOT LIKE '%{%}%' AND d2.value2 IS NOT NULL AND d1.value1 IS NOT NULL THEN 'modified'
            WHEN d2.value2 LIKE '{%}' AND d1.value1 LIKE '{%}' AND 
                (SELECT COUNT(*) FROM jsonb_object_keys(d1.value1::jsonb)) > 
                (SELECT COUNT(*) FROM jsonb_object_keys(d2.value2::jsonb)) THEN 'added'
            WHEN d2.value2 IS NULL AND d1.value1 LIKE '{%}' THEN 'added'
            WHEN d2.value2 LIKE '{%}' AND d1.value1 LIKE '{%}' AND 
                (SELECT COUNT(*) FROM jsonb_object_keys(d1.value1::jsonb)) < 
                (SELECT COUNT(*) FROM jsonb_object_keys(d2.value2::jsonb)) THEN 'removed'
            WHEN d2.value2 LIKE '{%}' AND d1.value1 IS NULL THEN 'removed'
            WHEN d2.value2 LIKE '{%}' AND d1.value1 LIKE '{%}' AND 
                (SELECT COUNT(*) FROM jsonb_object_keys(d1.value1::jsonb)) = 
                (SELECT COUNT(*) FROM jsonb_object_keys(d2.value2::jsonb)) THEN 'modified'
            WHEN d2.value2 LIKE '[%]' AND d1.value1 LIKE '[%]' AND 
                (SELECT COUNT(*) FROM jsonb_array_length(d1.value1::jsonb)) > 
                (SELECT COUNT(*) FROM jsonb_array_length(d2.value2::jsonb)) THEN 'added'
            WHEN d2.value2 IS NULL AND d1.value1 LIKE '[%]' THEN 'added'
            WHEN d2.value2 LIKE '[%]' AND d1.value1 LIKE '[%]' AND 
                (SELECT COUNT(*) FROM jsonb_array_length(d1.value1::jsonb)) < 
                (SELECT COUNT(*) FROM jsonb_array_length(d2.value2::jsonb)) THEN 'removed'
            WHEN d2.value2 LIKE '[%]' AND d1.value1 IS NULL THEN 'removed'
            WHEN d2.value2 LIKE '[%]' AND d1.value1 LIKE '[%]' AND 
                (SELECT COUNT(*) FROM jsonb_array_length(d1.value1::jsonb)) = 
                (SELECT COUNT(*) FROM jsonb_array_length(d2.value2::jsonb)) THEN 'modified'
            ELSE NULL
        END AS edit_type
    FROM data1_extracted d1
    JOIN data2_extracted d2 ON d1.log_id = d2.log_id AND d1.rn = d2.rn;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



DROP TRIGGER IF EXISTS logs_update_trigger_for_mapped_features ON public.logs;

CREATE TRIGGER logs_update_trigger_for_mapped_features
AFTER INSERT ON public.logs
FOR EACH ROW
EXECUTE FUNCTION update_mapped_features_on_trigger();