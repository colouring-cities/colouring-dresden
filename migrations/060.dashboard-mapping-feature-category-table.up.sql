-- THIS SQL FILE CONTAINS ALL RELEVANT DATABASE STEPS IN SQL, WHICH ARE REQUIRED TO SETUP THE DASHBOARD
-- THE DASHBOARD SHOWS THE SPATIO-TEMPORAL MAPPING ACITIVITIES WITHIN THE COLOURING CITIES INSTANCE

-- THIS FILE CREATE THE TABLE TO STORE DATA FOR BUILDING FEATURES AND ITS CATEGORIES

DROP TABLE IF EXISTS mapping_feature_category;

CREATE TABLE public.mapping_feature_category (
    id SERIAL PRIMARY KEY,
    feature_en VARCHAR NOT null,
    feature_de VARCHAR NOT null,
    category_en VARCHAR NOT null,
    category_de VARCHAR NOT null,
    crowd_sourced BOOLEAN DEFAULT false
);

INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Name des Gebäudes', 'location_name', 'Standort', 'location');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Wikidata ID', 'ref_wikidata', 'Standort', 'location');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Link Wikipedia', 'ref_wikipedia', 'Standort', 'location');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Wohngebäude?', 'is_domestic', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Originale Gebäudehauptnutzung', 'use_building_origin', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Originale Gebäudehauptnutzung (Text)', 'use_building_origin_text', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Aktuelle Gebäudehauptnutzung', 'use_building_current', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Aktuelle Gebäudehauptnutzung (Text)', 'use_building_current_text', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Art der Unterkellerung', 'basement_type', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anteil Unterkellerung', 'basement_percentage', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Aktuelle Nutzung des Kellers', 'basement_use', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Aktuelle Nutzung des Kellers (Datenquelle)', 'basement_use_source', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Nutzung Erdgeschoss', 'ground_storey_use', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Nutzung Erdgeschoss (Datenquelle)', 'ground_storey_use_source', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Nutzung 1. Etage und höher', 'upper_storeys_use', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Nutzung 1. Etage und höher (Datenquelle)', 'upper_storeys_use_source', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anzahl Wohneinheiten', 'use_number_residential_units', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anzahl Gewerbe', 'use_number_businesses', 'Nutzung', 'land use');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Morphologischer Bautyp/Nachbarschaft', 'building_attachment_form', 'Typologie', 'typology');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Dachform', 'size_roof_shape', 'Typologie', 'typology');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Dachform (Datenquelle)', 'size_roof_shape_source', 'Typologie', 'typology');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Eigentumsform', 'building_owner', 'Typologie', 'typology');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Eigentumsform (Datenquelle)', 'building_owner_source', 'Typologie', 'typology');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anzahl Hauptgeschosse', 'size_storeys_core', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anzahl Dachgeschosse', 'size_storeys_attic', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anzahl Kellergeschosse', 'size_storeys_basement', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Hauptkonstruktion', 'construction_system_type', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Hauptkonstruktion (Datenquelle)', 'construction_system_type_source', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Primärer Baustoff', 'construction_core_material', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Vorherrschende Dachbedeckung', 'construction_roof_covering', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Aktueller Gebäudezustand', 'building_status', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Aktueller Gebäudezustand (Datenquelle)', 'building_status_source', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Jahr der letzten Sanierung', 'last_renovation', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Jahr der letzten Sanierung (Datenquelle)', 'last_renovation_source', 'Konstruktion', 'construction');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Baustil und äußeres Erscheinungsbild', 'architectural_style', 'Alter & Geschichte', 'age & history');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Baustil und äußeres Erscheinungsbild (Datenquelle)', 'architectural_style_source', 'Alter & Geschichte', 'age & history');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Baujahr (beste Schätzung)', 'date_year', 'Alter & Geschichte', 'age & history');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Baujahr (frühest mögliches Jahr)', 'date_lower', 'Alter & Geschichte', 'age & history');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Baujahr (spätest mögliches Jahr)', 'date_upper', 'Alter & Geschichte', 'age & history');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Baujahr (Datenquelle)', 'date_source', 'Alter & Geschichte', 'age & history'); 
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Baujahr der Fassade', 'facade_year', 'Alter & Geschichte', 'age & history');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Dachfarbe', 'roof_colour', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Dachfarbe Oberfläche', 'roof_colour_type', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Fassadenfarbe', 'facade_colour', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anteil Fenster an Fassade', 'facade_window_percentage', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Himmelsrichtungen Fenster', 'direction_of_windows', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Objektive Einschätzung Hitzebelastung', 'thermal_stress_objective', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Subjektive Einschätzung Hitzebelastung', 'thermal_stress_subjective', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anpassungsmaßnahmen Hitze', 'heat_adaption_measure', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Anpassungsmaßnahmen Hitze (Datenquelle)', 'heat_adaption_measure_source', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Geländeanbindung', 'terrain_connection_yesno', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Differenz Gelände zu Erdgeschossboden', 'terrain_connection_difference', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Differenz Gelände zu Erdgeschossboden (Datenquelle)', 'terrain_connection_difference_source', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Historische Betroffenheit Hochwasser/Starkregen', 'rain_flood_historic_incidents', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Vorsorgemaßnahmen Strategie Ausweichen', 'rain_flood_preventive_measures1', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Vorsorgemaßnahmen Strategie Widerstehen', 'rain_flood_preventive_measures2', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Vorsorgemaßnahmen Strategie Nachgeben', 'rain_flood_preventive_measures3', 'Resilienz', 'resilience');
INSERT INTO public.mapping_feature_category (feature_de, feature_en, category_de, category_en) VALUES ('Vorsorgemaßnahmen Starkregen/Hochwasser (Datenquelle)', 'rain_flood_preventive_measures_source', 'Resilienz', 'resilience');

UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'location_name';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'ref_wikidata';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'ref_wikipedia';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'is_domestic';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'use_building_origin';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'use_building_origin_text';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'use_building_current';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'use_building_current_text';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'basement_type';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'basement_percentage';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'basement_use';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'basement_use_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'ground_storey_use';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'ground_storey_use_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'upper_storeys_use';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'upper_storeys_use_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'use_number_residential_units';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'use_number_businesses';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'building_attachment_form';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'size_roof_shape';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'size_roof_shape_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'building_owner';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'building_owner_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'size_storeys_core';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'size_storeys_attic';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'size_storeys_basement';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'construction_system_type';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'construction_system_type_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'construction_core_material';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'construction_roof_covering';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'building_status';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'building_status_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'last_renovation';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'last_renovation_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'architectural_style';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'architectural_style_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'date_year';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'date_lower';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'date_upper';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'date_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'facade_year';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'roof_colour';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'roof_colour_type';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'facade_colour';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'thermal_stress_objective';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'thermal_stress_subjective';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'facade_window_percentage';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'direction_of_windows';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'heat_adaption_measure';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'terrain_connection_yesno';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'terrain_connection_difference';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'rain_flood_preventive_measures1';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'rain_flood_preventive_measures2';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'rain_flood_preventive_measures3';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'rain_flood_historic_incidents';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'heat_adaption_measure_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'terrain_connection_difference_source';
UPDATE public.mapping_feature_category SET crowd_sourced = true WHERE feature_en = 'rain_flood_preventive_measures_source';

CREATE INDEX feature_en_idx ON mapping_feature_category (feature_en);