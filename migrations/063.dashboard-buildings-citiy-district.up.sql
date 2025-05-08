-- THIS SQL FILE CONTAINS ALL RELEVANT DATABASE STEPS IN SQL, WHICH ARE REQUIRED TO SETUP THE DASHBOARD
-- THE DASHBOARD SHOWS THE SPATIO-TEMPORAL MAPPING ACITIVITIES WITHIN THE COLOURING CITIES INSTANCE

-- THIS FILE LINKS THE ID OF CITY DISTRICT INTO THE EXISTING BUILDING TABLE

ALTER TABLE public.buildings
ADD city_district_id INT REFERENCES public.city_districts(city_district_id);


UPDATE public.buildings AS b
SET city_district_id = d.city_district_id
FROM public.city_districts AS d
WHERE ST_Contains(d.geometry,ST_SetSRID(ST_Point(b.location_longitude, b.location_latitude), 4326)
);

UPDATE public.buildings AS b
SET city_district_id = (
    SELECT d.city_district_id
    FROM public.city_districts AS d
    ORDER BY ST_Distance(
        d.geometry,
        ST_SetSRID(ST_Point(b.location_longitude, b.location_latitude), 4326)
    ) ASC
    LIMIT 1
)
WHERE city_district_id IS NULL AND b.location_latitude IS NOT NULL AND b.location_longitude IS NOT NULL;
