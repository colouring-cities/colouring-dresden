import path from 'path';

import db from '../../db';

interface ByDay_Row {
    date: Date;
    label: string;
    value: number;
}
interface ByDay {
    date: Date;
    label: string;
    value: number;
}

interface GeoJSON_Row {
    geojson: any;
}
interface GeoJSON {
    geojson: any;
}


interface ValueOnly_Row {
    value: number;
}
interface ValueOnly {
    value: number;
}

interface ValueCount_Row {
    value: string;
    count: number;
}
interface ValueCount {
    value: string;
    count: number;
}

interface TimeIntervalCount_Row {
    time_interval: string;
    label_time_interval: string;
    count: number;
}
interface TimeIntervalCount {
    time_interval: string;
    label_time_interval: string;
    count: number;
}

interface TopMapperValuesTimeInterval_Row {
    name: string;
    number_mapped_attributes: number;
    time_interval: string;
    label_time_interval: string;
}
interface TopMapperValuesTimeInterval {
    name: string;
    number_mapped_attributes: number;
    time_interval: string;
    label_time_interval: string;
}

interface TopFlopAttributesValueLabelCountTimeInterval_Row {
    attribute: string;
    label_attribute: string;
    number_mapped_attributes: number;
    time_interval: string;
    label_time_interval: string;
}
interface TopFlopAttributesValueLabelCountTimeInterval {
    attribute: string;
    label_attribute: string;
    number_mapped_attributes: number;
    time_interval: string;
    label_time_interval: string;
}

interface LastEdits_Row {
    date: Date;
    label_date: string;
    time: string;
    location_latitude: number;
    location_longitude: number;
    city_district: string;
    time_interval: string;
    label_time_interval: string;
    added_count: number;
    modified_count: number;
    removed_count: number;
    total_count: number;
}
interface LastEdits {
    date: Date;
    label_date: string;
    time: string;
    location_latitude: number;
    location_longitude: number;
    city_district: string;
    time_interval: string;
    label_time_interval: string;
    added_count: number;
    modified_count: number;
    removed_count: number;
    total_count: number;
}

interface CoveragePerAttribute_Row {
    attribute: string;
    label_attribute: string;
    number_citizens: number;
    number_bulk: number;
    total: number;
}
interface CoveragePerAttribute {
    attribute: string;
    label_attribute: string;
    number_citizens: number;
    number_bulk: number;
    total: number;
}

interface BaseAllAttributes {
    date: Date;
    label_date: string;
}
type AttributeKeys =
    | 'ref_wikidata'
    | 'ref_wikipedia'
    | 'is_domestic'
    | 'use_building_origin'
    | 'use_building_origin_text'
    | 'use_building_current'
    | 'use_building_current_text'
    | 'basement_type'
    | 'basement_percentage'
    | 'basement_use'
    | 'basement_use_source'
    | 'ground_storey_use'
    | 'ground_storey_use_source'
    | 'upper_storeys_use'
    | 'upper_storeys_use_source'
    | 'use_number_residential_units'
    | 'use_number_businesses'
    | 'building_attachment_form'
    | 'size_roof_shape'
    | 'size_roof_shape_source'
    | 'building_owner'
    | 'building_owner_source'
    | 'size_storeys_core'
    | 'size_storeys_attic'
    | 'size_storeys_basement'
    | 'size_height_apex'
    | 'size_floor_area_ground'
    | 'size_floor_area_total'
    | 'size_width_frontage'
    | 'construction_system_type'
    | 'construction_system_type_source'
    | 'construction_core_material'
    | 'construction_secondary_materials'
    | 'construction_roof_covering'
    | 'building_status'
    | 'building_status_source'
    | 'last_renovation'
    | 'last_renovation_source'
    | 'architectural_style'
    | 'architectural_style_source'
    | 'date_year'
    | 'date_lower'
    | 'date_upper'
    | 'date_source'
    | 'facade_year'
    | 'roof_colour'
    | 'roof_colour_type'
    | 'facade_colour'
    | 'thermal_stress_objective'
    | 'thermal_stress_subjective'
    | 'facade_window_percentage'
    | 'direction_of_windows'
    | 'heat_adaption_measure'
    | 'terrain_connection_yesno'
    | 'terrain_connection_difference'
    | 'rain_flood_preventive_measures1'
    | 'rain_flood_preventive_measures2'
    | 'rain_flood_preventive_measures3'
    | 'rain_flood_historic_incidents'
    | 'heat_adaption_measure_source'
    | 'terrain_connection_difference_source'
    | 'rain_flood_preventive_measures_source';
type ByDayCoverageAllAttributes = BaseAllAttributes & {
    [key in AttributeKeys]: number;
};

interface ByDayCoverageSingleAttribute_Row {
    date: Date;
    label_date: string;
    number_mapped_citizens: number;
    number_mapped_bulk: number;
}
interface ByDayCoverageSingleAttribute {
    date: Date;
    label_date: string;
    number_mapped_citizens: number;
    number_mapped_bulk: number;
}


async function service_TodayNumberNewAccounts(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.count,0) AS "value" 
            FROM generate_series(CURRENT_DATE
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT COUNT(*) AS "count", DATE_TRUNC ('day', registered)::date AS "date" 
                FROM public.users 
                WHERE registered::date = CURRENT_DATE::timestamp 
                GROUP BY DATE_TRUNC ('day', registered)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}


async function service_TodayNumberAccountsTotal(): Promise<ValueOnly[]> {
    try {
        const extractRecords = await db.manyOrNone<ValueOnly_Row>(
            `SELECT COUNT(*) AS "value" FROM public.users`
        );

        return extractRecords.map(getValueOnly);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}


async function service_TodayNumberActiveAccounts(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.count,0) AS "value" 
            FROM generate_series(CURRENT_DATE
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT DATE_TRUNC ('day', log_timestamp) AS "date", COUNT (DISTINCT user_id) AS "count" FROM public.logs 
                WHERE log_timestamp::date = CURRENT_DATE::timestamp
                GROUP BY DATE_TRUNC ('day', log_timestamp)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TodayNumberEdits(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.count,0) AS "value" 
            FROM generate_series(CURRENT_DATE
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT COUNT(*) AS "count", DATE_TRUNC ('day', log_timestamp) AS "date" 
                FROM public.logs 
                WHERE log_timestamp::date = CURRENT_DATE::timestamp 
                AND user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE_TRUNC ('day', log_timestamp)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TodayNumberMappedAttributes(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.sum,0) AS "value" 
            FROM generate_series(CURRENT_DATE
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT DATE_TRUNC ('day', src.log_timestamp) AS "date", SUM(src.anzahl_merkmale) AS "sum" FROM 
                (
                    SELECT *, 
                    (SELECT COUNT(*) FROM jsonb_object_keys(forward_patch)) AS anzahl_merkmale
                    FROM public.logs 
                    WHERE log_timestamp::date = CURRENT_DATE::timestamp 
                    AND user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                    ORDER BY log_timestamp DESC
                ) AS src
            GROUP BY DATE_TRUNC ('day', src.log_timestamp)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberNewAccounts(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.count,0) AS "value" 
            FROM generate_series(timestamp '2023-03-06'
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT COUNT(*) AS "count", DATE_TRUNC ('day', registered)::date AS "date" 
                FROM public.users 
                WHERE registered > '2023-03-06 00:00:00'::timestamp 
                AND registered <= NOW()::timestamp 
                GROUP BY DATE_TRUNC ('day', registered)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberActiveAccounts(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.count,0) AS "value" 
            FROM generate_series(timestamp '2023-03-06'
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT DATE_TRUNC ('day', log_timestamp) AS "date", COUNT (DISTINCT user_id) AS "count" FROM public.logs 
                WHERE log_timestamp > '2023-03-06 00:00:00'::timestamp 
                AND log_timestamp <= NOW()::timestamp
                GROUP BY DATE_TRUNC ('day', log_timestamp)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberEdits(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.count,0) AS "value" 
            FROM generate_series(timestamp '2023-03-06'
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT COUNT(*) AS "count", DATE_TRUNC ('day', log_timestamp) AS "date" 
                FROM public.logs 
                WHERE log_timestamp > '2023-03-06 00:00:00'::timestamp 
                AND log_timestamp <= NOW()::timestamp 
                AND user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE_TRUNC ('day', log_timestamp)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberMappedAttributes(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `SELECT to_char(t.day::date, 'YYYY-MM-DD') AS "date",
                to_char(t.day::date, 'DD.MM.YYYY') AS "label",
                COALESCE(requested_data.sum,0) AS "value" 
            FROM generate_series(timestamp '2023-03-06'
                             , CURRENT_DATE
                             , interval  '1 day') AS t(day)
            LEFT JOIN
                (SELECT DATE_TRUNC ('day', src.log_timestamp) AS "date", SUM(src.anzahl_merkmale) AS "sum" FROM 
                    (
                        SELECT *, 
                        (SELECT COUNT(*) FROM jsonb_object_keys(forward_patch)) AS anzahl_merkmale
                        FROM public.logs 
                        WHERE log_timestamp > '2023-03-06 00:00:00'::timestamp 
                        AND log_timestamp <= NOW()::timestamp 
                        AND user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                        ORDER BY log_timestamp DESC
                    ) AS src
                GROUP BY DATE_TRUNC ('day', src.log_timestamp)) AS requested_data
            ON t.day::date=requested_data.date`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_HistogramByAttribute(field: string): Promise<ValueCount[]> {
    try {
        const extractRecord = await db.manyOrNone<ValueCount_Row>(
            `SELECT ${field} AS "value", 
                COUNT(*) AS "count"
            FROM public.buildings
            WHERE ${field} IS NOT NULL
            GROUP BY ${field}
            ORDER BY "count" DESC, "value" ASC
            `);

        return extractRecord.map(getValueCount);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerNumberNewAccounts(): Promise<TimeIntervalCount[]> {
    try {
        const extractRecords = await db.manyOrNone<TimeIntervalCount_Row>(
            `SELECT 
                'Today' AS time_interval,
                'Heute' AS label_time_interval,
                COUNT(*) AS count
            FROM public.users u
            WHERE 
                u.registered >= CURRENT_DATE
                AND u.registered <= CURRENT_TIMESTAMP
                AND u.username NOT LIKE '%_robots'
            UNION ALL
            SELECT 
                'Last 24h' AS time_interval,
                'Letzte 24h' AS label_time_interval,
                COUNT(*) AS count
            FROM public.users u
            WHERE 
                (u.registered >= CURRENT_TIMESTAMP - INTERVAL '24 hours')
                AND (u.registered <= CURRENT_TIMESTAMP)
                AND u.username NOT LIKE '%_robots'
            UNION ALL
            SELECT 
                'Last 7 days' AS time_interval,
                'Letzte 7 Tage' AS label_time_interval,
                COUNT(*) AS count
            FROM public.users u
            WHERE 
                (u.registered >= CURRENT_DATE - INTERVAL '7 days')
                AND (u.registered <= CURRENT_TIMESTAMP)
                AND u.username NOT LIKE '%_robots';`
        );

        return extractRecords.map(getTimeIntervalCount);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerNumberActiveAccounts(): Promise<TimeIntervalCount[]> {
    try {
        const extractRecords = await db.manyOrNone<TimeIntervalCount_Row>(
            `SELECT 
                'Today' AS time_interval,
                'Heute' AS label_time_interval,
                COUNT(DISTINCT l.user_id) AS count
            FROM public.logs l
            WHERE 
                l.log_timestamp >= CURRENT_DATE 
                AND l.log_timestamp <= CURRENT_TIMESTAMP
                AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
            UNION ALL
            SELECT 
                'Last 24h' AS time_interval,
                'Letzte 24h' AS label_time_interval,
                COUNT(DISTINCT l.user_id) AS count
            FROM public.logs l
            WHERE 
                (l.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours')
                AND (l.log_timestamp <= CURRENT_TIMESTAMP)
                AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
            UNION ALL
            SELECT 
                'Last 7 days' AS time_interval,
                'Letzte 7 Tage' AS label_time_interval,
                COUNT(DISTINCT l.user_id) AS count
            FROM public.logs l
            WHERE 
                (l.log_timestamp >= CURRENT_DATE - INTERVAL '7 days')
                AND (l.log_timestamp <= CURRENT_TIMESTAMP)
                AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots');`
        );

        return extractRecords.map(getTimeIntervalCount);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerNumberEdits(): Promise<TimeIntervalCount[]> {
    try {
        const extractRecords = await db.manyOrNone<TimeIntervalCount_Row>(
            `SELECT 
                'Today' AS time_interval,
                'Heute' AS label_time_interval,
                COUNT(*) AS count
            FROM public.logs l
            WHERE 
                l.log_timestamp >= CURRENT_DATE 
                AND l.log_timestamp <= CURRENT_TIMESTAMP
                AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
            UNION ALL
            SELECT 
                'Last 24h' AS time_interval,
                'Letzte 24h' AS label_time_interval,
                COUNT(*) AS number_edits
            FROM public.logs l
            WHERE 
                (l.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours')
                AND (l.log_timestamp <= CURRENT_TIMESTAMP)
                AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
            UNION ALL
            SELECT 
                'Last 7 days' AS time_interval,
                'Letzte 7 Tage' AS label_time_interval,
                COUNT(*) AS number_edits
            FROM public.logs l
            WHERE 
                (l.log_timestamp >= CURRENT_DATE - INTERVAL '7 days')
                AND (l.log_timestamp <= CURRENT_TIMESTAMP)
                AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots');`
        );

        return extractRecords.map(getTimeIntervalCount);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerNumberMappedAttributes(): Promise<TimeIntervalCount[]> {
    try {
        const extractRecords = await db.manyOrNone<TimeIntervalCount_Row>(
            `SELECT 
                'Today' AS time_interval,
                'Heute' AS label_time_interval,
                COUNT(*) AS count
            FROM public.mapped_features f
            WHERE 
                f.log_timestamp >= CURRENT_DATE 
                AND f.log_timestamp <= CURRENT_TIMESTAMP
                AND f.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
            UNION ALL
            SELECT 
                'Last 24h' AS time_interval,
                'Letzte 24h' AS label_time_interval,
                COUNT(*) AS count
            FROM public.mapped_features f
            WHERE 
                (f.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours')
                AND (f.log_timestamp <= CURRENT_TIMESTAMP)
                AND f.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
            UNION ALL
            SELECT 
                'Last 7 days' AS time_interval,
                'Letzte 7 Tage' AS label_time_interval,
                COUNT(*) AS count
            FROM public.mapped_features f
            WHERE 
                (f.log_timestamp >= CURRENT_DATE - INTERVAL '7 days')
                AND (f.log_timestamp <= CURRENT_TIMESTAMP)
                AND f.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots');`
        );

        return extractRecords.map(getTimeIntervalCount);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerLastEdits(): Promise<LastEdits[]> {
    try {
        const extractRecords = await db.manyOrNone<LastEdits_Row>(
            `WITH log_details AS (
                SELECT
                    l.log_id,
                    TO_CHAR(l.log_timestamp, 'YYYY-MM-DD') AS date,
                    TO_CHAR(l.log_timestamp, 'DD.MM.YYYY') AS label_date,
                    TO_CHAR(l.log_timestamp, 'HH24:MI:SS') AS time,
                    b.location_latitude,
                    b.location_longitude,
                    city_districts.name as city_district, 
                    CASE 
                        WHEN l.log_timestamp >= CURRENT_DATE THEN 'Today|Last 24h|Last 7 days'
                        WHEN l.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours' THEN 'Last 24h|Last 7 days'
                        WHEN l.log_timestamp >= CURRENT_DATE - INTERVAL '7 days' THEN 'Last 7 days'
                        ELSE ' '
                    END AS time_interval,
                    CASE 
                        WHEN l.log_timestamp >= CURRENT_DATE THEN 'Heute|Letzte 24h|Letzte 7 Tage'
                        WHEN l.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours' THEN 'Letzte 24h|Letzte 7 Tage'
                        WHEN l.log_timestamp >= CURRENT_DATE - INTERVAL '7 days' THEN 'Letzte 7 Tage'
                        ELSE ' '
                    END AS label_time_interval
                FROM public.logs l
                LEFT JOIN 
                    buildings b ON l.building_id = b.building_id
                LEFT JOIN 
                    city_districts ON city_districts.city_district_id = b.city_district_id 
                WHERE (l.log_timestamp >= CURRENT_DATE - INTERVAL '7 days') AND (l.log_timestamp <= CURRENT_TIMESTAMP)
                    AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_108')
            )
            SELECT
                MIN(l.date) AS date,  -- Verwendung von Aggregatfunktionen damit nicht alle Attribute in der GROUP BY Klausel angegeben werden müssen --> so deutlich effizienter
                MIN(l.label_date) AS label_date,
                MIN(l.time) AS time,
                MIN(l.location_latitude) AS location_latitude,
                MIN(l.location_longitude) AS location_longitude,
                MIN(l.city_district) AS city_district,
                MIN(l.time_interval) AS time_interval,
                MIN(l.label_time_interval) AS label_time_interval,
                COUNT(CASE WHEN f.edit_type = 'added' THEN 1 END) AS added_count,
                COUNT(CASE WHEN f.edit_type = 'modified' THEN 1 END) AS modified_count,
                COUNT(CASE WHEN f.edit_type = 'removed' THEN 1 END) AS removed_count,
                COUNT(CASE WHEN f.edit_type IN ('added', 'modified', 'removed') THEN 1 END) AS total_count
            FROM
                mapped_features f
            JOIN
                log_details l ON l.log_id = f.log_id
            GROUP BY
                l.log_id
            ORDER BY l.log_id DESC;`
        );

        return extractRecords.map(getLastEdits);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerTopMapper(): Promise<TopMapperValuesTimeInterval[]> {
    try {
        const extractRecords = await db.manyOrNone<TopMapperValuesTimeInterval_Row>(
            `SELECT a.* FROM (
                SELECT 
                    u.username AS name,
                    COUNT(*) AS number_mapped_attributes,
                    'Today' AS time_interval,
                    'Heute' AS label_time_interval
                FROM public.mapped_features f
                JOIN public.users u ON f.user_id = u.user_id
                WHERE 
                    f.log_timestamp >= CURRENT_DATE 
                    AND f.log_timestamp <= CURRENT_TIMESTAMP
                    AND u.username NOT LIKE '%_robots'
                GROUP BY u.username
                ORDER BY number_mapped_attributes DESC
                LIMIT 10
            ) a
            UNION ALL
            SELECT b.* FROM (
                SELECT 
                    u.username AS name,
                    COUNT(*) AS number_mapped_attributes,
                    'Last 24h' AS time_interval,
                    'Letzte 24h' AS label_time_interval
                FROM public.mapped_features f
                JOIN public.users u ON f.user_id = u.user_id
                WHERE 
                    f.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
                    AND f.log_timestamp <= CURRENT_TIMESTAMP
                    AND u.username NOT LIKE '%_robots'
                GROUP BY u.username
                ORDER BY number_mapped_attributes DESC
                LIMIT 10
            ) b
            UNION ALL
            SELECT c.* FROM (
                SELECT 
                    u.username AS name,
                    COUNT(*) AS number_mapped_attributes,
                    'Last 7 days' AS time_interval,
                    'Letzte 7 Tage' AS label_time_interval
                FROM public.mapped_features f
                JOIN public.users u ON f.user_id = u.user_id
                WHERE 
                    f.log_timestamp >= CURRENT_DATE - INTERVAL '7 days'
                    AND f.log_timestamp <= CURRENT_TIMESTAMP
                    AND u.username NOT LIKE '%_robots'
                GROUP BY u.username
                ORDER BY number_mapped_attributes DESC
                LIMIT 10) c;`
        );

        return extractRecords.map(getTopMapperValuesTimeInterval);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerTopAttributes(): Promise<TopFlopAttributesValueLabelCountTimeInterval[]> {
    try {
        const extractRecords = await db.manyOrNone<TopFlopAttributesValueLabelCountTimeInterval_Row>(
            `(SELECT
                    mf.feature AS attribute,
                    f.feature_de AS label_attribute,
                    COUNT(*) AS number_mapped_attributes,
                    'Today' AS time_interval,
                    'Heute' AS label_time_interval
                FROM public.mapped_features mf
                LEFT JOIN public.mapping_feature_category f ON f.feature_en = mf.feature
                WHERE mf.log_timestamp >= CURRENT_DATE 
                    AND mf.log_timestamp <= CURRENT_TIMESTAMP
                    AND mf.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY mf.feature, f.feature_de
                ORDER BY number_mapped_attributes DESC, attribute ASC
                LIMIT 10)
                UNION ALL
                (SELECT
                    mf.feature AS attribute,
                    f.feature_de AS label_attribute,
                    COUNT(*) AS number_mapped_attributes,
                    'Last 24h' AS time_interval,
                    'Letzte 24h' AS label_time_interval
                FROM public.mapped_features mf
                LEFT JOIN public.mapping_feature_category f ON f.feature_en = mf.feature
                WHERE mf.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
                    AND mf.log_timestamp <= CURRENT_TIMESTAMP
                    AND mf.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY mf.feature, f.feature_de
                ORDER BY number_mapped_attributes DESC, attribute ASC
                LIMIT 10)
                UNION ALL
                (SELECT
                    mf.feature AS attribute,
                    f.feature_de AS label_attribute,
                    COUNT(*) AS number_mapped_attributes,
                    'Last 7 days' AS time_interval,
                    'Letzte 7 Tage' AS label_time_interval
                FROM public.mapped_features mf 
                LEFT JOIN public.mapping_feature_category f ON f.feature_en = mf.feature
                WHERE mf.log_timestamp >= CURRENT_DATE - INTERVAL '7 days'
                    AND mf.log_timestamp <= CURRENT_TIMESTAMP
                    AND mf.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY mf.feature, f.feature_de
                ORDER BY number_mapped_attributes DESC, attribute ASC
                LIMIT 10);`
        );

        return extractRecords.map(getTopFlopAttributesValueLabelCountTimeInterval);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_TickerFlopAttributes(): Promise<TopFlopAttributesValueLabelCountTimeInterval[]> {
    try {
        const extractRecords = await db.manyOrNone<TopFlopAttributesValueLabelCountTimeInterval_Row>(
            `(SELECT 
                f.feature_en AS attribute,
                f.feature_de AS label_attribute,
                COALESCE(lc.anzahl_merkmale, 0) AS number_mapped_attributes,
                'Today' AS time_interval,
                'Heute' AS label_time_interval
            FROM public.mapping_feature_category f
            LEFT JOIN (
                SELECT 
                    feature,
                    COUNT(*) AS anzahl_merkmale
                FROM public.mapped_features mf 
                WHERE mf.log_timestamp >= CURRENT_DATE 
                AND mf.log_timestamp <= CURRENT_TIMESTAMP
                AND mf.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY feature
                ) lc 
                ON lc.feature = f.feature_en
            WHERE f.crowd_sourced = true
            ORDER BY COALESCE(lc.anzahl_merkmale, 0), attribute ASC
            LIMIT 10)
            UNION ALL
            (SELECT 
                f.feature_en AS attribute,
                f.feature_de AS label_attribute,
                COALESCE(lc.anzahl_merkmale, 0) AS number_mapped_attributes,
                'Last 24h' AS time_interval,
                'Letzte 24h' AS label_time_interval
            FROM public.mapping_feature_category f
            LEFT JOIN (
                SELECT 
                    feature,
                    COUNT(*) AS anzahl_merkmale
                FROM public.mapped_features mf 
                WHERE mf.log_timestamp >= CURRENT_TIMESTAMP - INTERVAL '24 hours'
                AND mf.log_timestamp <= CURRENT_TIMESTAMP
                AND mf.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY feature
                ) lc 
                ON lc.feature = f.feature_en
            WHERE f.crowd_sourced = true
            ORDER BY COALESCE(lc.anzahl_merkmale, 0), attribute ASC
            LIMIT 10)
            UNION ALL
            (SELECT 
                f.feature_en AS attribute,
                f.feature_de AS label_attribute,
                COALESCE(lc.anzahl_merkmale, 0) AS number_mapped_attributes,
                'Last 7 days' AS time_interval,
                'Letzte 7 Tage' AS label_time_interval
            FROM public.mapping_feature_category f
            LEFT JOIN (
                SELECT 
                    feature,
                    COUNT(*) AS anzahl_merkmale
                FROM public.mapped_features mf 
                WHERE mf.log_timestamp >= CURRENT_DATE - INTERVAL '7 days'
                AND mf.log_timestamp <= CURRENT_TIMESTAMP
                AND mf.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY feature
                ) lc 
                ON lc.feature = f.feature_en
            WHERE f.crowd_sourced = true
            ORDER BY COALESCE(lc.anzahl_merkmale, 0), attribute ASC
            LIMIT 10);`
        );

        return extractRecords.map(getTopFlopAttributesValueLabelCountTimeInterval);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_CoveragePerAttribute(): Promise<CoveragePerAttribute[]> {
    try {
        const extractRecords = await db.manyOrNone<CoveragePerAttribute_Row>(
            `WITH latest_logs AS (
                SELECT
                    f.building_id,
                    f.feature AS merkmal,
                    f.forward_value AS wert,
                    f.user_id,
                    f.log_timestamp,
                    ROW_NUMBER() OVER (
                        PARTITION BY f.building_id, f.feature
                        ORDER BY f.log_timestamp DESC
                    ) AS rn
                FROM public.mapped_features f
            ),
            aggregated_logs AS (
                SELECT 
                    ll.merkmal,
                    SUM(CASE WHEN u.username LIKE '%_robots' THEN 1 ELSE 0 END) AS anzahl_bulk,
                    SUM(CASE WHEN u.username NOT LIKE '%_robots' OR u.username IS NULL THEN 1 ELSE 0 END) AS anzahl_citiz
                FROM latest_logs ll
                LEFT JOIN public.users u ON ll.user_id = u.user_id
                WHERE ll.rn = 1 AND ll.wert IS NOT NULL
                GROUP BY ll.merkmal
            )
            SELECT 
                f.feature_en AS attribute,
                f.feature_de AS label_attribute,
                COALESCE(al.anzahl_citiz, 0) AS number_citizens,
                COALESCE(al.anzahl_bulk, 0) AS number_bulk,
                COALESCE(al.anzahl_citiz, 0) + COALESCE(al.anzahl_bulk, 0) AS total
            FROM public.mapping_feature_category f
            LEFT JOIN aggregated_logs al ON al.merkmal = f.feature_en
            ORDER BY total DESC, attribute ASC;`
        );

        return extractRecords.map(getCoveragePerAttribute);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

/***************************************************************************************//*

                Wie muss die Rückgabe als .geojson hier integriert werden?

*//**************************************************************************************/
async function service_CoveragePerCityDistrictGEOJSON(): Promise<GeoJSON[]> {
    try {
        const result = await db.oneOrNone<GeoJSON_Row>(
            `CREATE OR REPLACE FUNCTION __tmp_dynamic_building_attribute_count()
                RETURNS TABLE(building_id INT, city_district_id INT, attribute_count INT) AS $$
                DECLARE 
                    sql_query TEXT := 'SELECT building_id, city_district_id, ';
                    rec RECORD;
                BEGIN
                    FOR rec IN 
                        SELECT feature_en 
                        FROM public.mapping_feature_category
                    LOOP
                        sql_query := sql_query || 
                            'CAST(COUNT(CASE WHEN ' || rec.feature_en || ' IS NOT NULL THEN 1 END) AS INT) + ';
                    END LOOP;
                    sql_query := left(sql_query, length(sql_query) - 2);  -- Remove trailing " + "
                    sql_query := sql_query || ' FROM buildings GROUP BY building_id;';
                    RETURN QUERY EXECUTE sql_query;
                END $$ LANGUAGE plpgsql;

            WITH total_attribute_count_sum AS (
                SELECT COUNT(*) AS total_attributes FROM mapping_feature_category
            ),
            building_attribute_sum AS (
                SELECT 
                    ba.city_district_id AS id,
                    SUM(ba.attribute_count) AS total_attribute_count,
                    COUNT(ba.building_id) AS total_buildings
                FROM __tmp_dynamic_building_attribute_count() ba
                GROUP BY ba.city_district_id
            ), 
            city_districts_with_attributes AS (
                SELECT
                    city_districts.name AS city_district,
                    bas.id,
                    bas.total_attribute_count AS number_mapped_properties,
                    (bas.total_attribute_count::FLOAT / bas.total_buildings / tac.total_attributes) AS mapped_percent,
                    city_districts.geometry 
                FROM building_attribute_sum bas
                JOIN total_attribute_count_sum tac ON true
                RIGHT JOIN city_districts on city_districts.city_district_id = bas.id
            )
            SELECT json_build_object(
            'type',     'FeatureCollection',
            'features', json_agg(
                json_build_object(
                'type',       'Feature',
                'geometry',   ST_AsGeoJSON(geometry)::json,
                'properties', json_build_object(
                    'id', id,
                    'city_district', city_district,
                    'number_mapped_properties', number_mapped_properties,
                    'mapped_percent', mapped_percent
                )
                )
            )
            ) AS geojson
            FROM city_districts_with_attributes;`
        );

        return result?.geojson || { type: "FeatureCollection", features: [] };
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberEditsCitizens(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH edits AS (
                SELECT DATE(l.log_timestamp) AS log_date, COUNT(*) AS edit_count
                FROM logs l
                WHERE l.log_timestamp >= '2023-03-06'::DATE AND l.log_timestamp <= NOW()::timestamp
                    AND l.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(l.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date, 	
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(e.edit_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN edits e ON s.day = e.log_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberAttributesCitizens(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH merkmale AS (
                SELECT 
                    DATE(f.log_timestamp) AS log_date,
                    COUNT(*) AS merkmale_count
                FROM mapped_features f
                WHERE f.log_timestamp >= '2023-03-06'::DATE AND f.log_timestamp <= NOW()::timestamp
                    AND f.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(f.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(m.merkmale_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN merkmale m ON s.day = m.log_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberAddedAttributesCitizens(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH merkmale AS (
                SELECT 
                    DATE(f.log_timestamp) AS log_date,
                    COUNT(*) AS merkmale_count
                FROM mapped_features f
                WHERE edit_type = 'added'
                    AND f.log_timestamp >= '2023-03-06'::DATE AND f.log_timestamp <= NOW()::timestamp
                    AND f.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(f.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(m.merkmale_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN merkmale m ON s.day = m.log_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberModifiedAttributesCitizens(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH merkmale AS (
                SELECT 
                    DATE(f.log_timestamp) AS log_date,
                    COUNT(*) AS merkmale_count
                FROM mapped_features f
                WHERE edit_type = 'modified'
                    AND f.log_timestamp >= '2023-03-06'::DATE AND f.log_timestamp <= NOW()::timestamp
                    AND f.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(f.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(m.merkmale_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN merkmale m ON s.day = m.log_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberRemovedAttributesCitizens(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH merkmale AS (
                SELECT 
                    DATE(f.log_timestamp) AS log_date,
                    COUNT(*) AS merkmale_count
                FROM mapped_features f
                WHERE edit_type = 'removed'
                    AND f.log_timestamp >= '2023-03-06'::DATE AND f.log_timestamp <= NOW()::timestamp
                    AND f.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(f.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(m.merkmale_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN merkmale m ON s.day = m.log_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberVerificationsCitizens(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH verifications AS (
                SELECT DATE(v.verification_timestamp) AS verification_date, COUNT(*) AS verification_count
                FROM building_verification v
                WHERE v.verification_timestamp >= '2023-03-06'::DATE AND v.verification_timestamp <= NOW()::timestamp
                    AND v.user_id NOT IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(v.verification_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(v.verification_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN verifications v ON s.day = v.verification_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberAddedAttributesBulk(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH merkmale AS (
                SELECT 
                    DATE(f.log_timestamp) AS log_date,
                    COUNT(*) AS merkmale_count
                FROM mapped_features f
                WHERE edit_type = 'added'
                    AND f.log_timestamp >= '2023-03-06'::DATE AND f.log_timestamp <= NOW()::timestamp
                    AND f.user_id IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(f.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(m.merkmale_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN merkmale m ON s.day = m.log_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayNumberModifiedAttributesBulk(): Promise<ByDay[]> {
    try {
        const extractRecords = await db.manyOrNone<ByDay_Row>(
            `WITH merkmale AS (
                SELECT 
                    DATE(f.log_timestamp) AS log_date,
                    COUNT(*) AS merkmale_count
                FROM mapped_features f
                WHERE edit_type = 'modified'
                    AND f.log_timestamp >= '2023-03-06'::DATE AND f.log_timestamp <= NOW()::timestamp
                    AND f.user_id IN (SELECT user_id FROM public.users WHERE username LIKE '%_robots')
                GROUP BY DATE(f.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label,
                COALESCE(m.merkmale_count, 0) AS value
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN merkmale m ON s.day = m.log_date
            ORDER BY s.day DESC;`
        );

        return extractRecords.map(getByDay);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayCoverageAllAttributes(): Promise<ByDayCoverageAllAttributes[]> {
    try {
        const extractRecords = await db.manyOrNone<any>(
            `WITH latest_logs AS (
                SELECT
                    f.feature AS key,
                    f.forward_value AS value,
                    f.log_timestamp,
                    ROW_NUMBER() OVER (
                        PARTITION BY f.building_id, f.feature
                        ORDER BY f.log_timestamp DESC
                    ) AS rn
                FROM public.mapped_features f
            ),
            aggregated_logs AS (
                SELECT 
                    TO_CHAR(ll.log_timestamp, 'YYYY-MM-DD') AS log_date,
                    ll.key,
                    COUNT(*) AS anzahl
                FROM latest_logs ll
                WHERE ll.rn = 1 AND ll.value IS NOT NULL
                GROUP BY TO_CHAR(ll.log_timestamp, 'YYYY-MM-DD'), ll.key
            ),
            pivoted_logs AS (
                SELECT
                    gs.day AS date,
                    f.feature_en,
                    COALESCE(SUM(CASE WHEN al.key = f.feature_en THEN al.anzahl ELSE 0 END), 0) AS count_per_attribute
                FROM 
                    (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) gs
                CROSS JOIN mapping_feature_category f
                LEFT JOIN aggregated_logs al ON gs.day::text = al.log_date AND f.feature_en = al.key
                GROUP BY gs.day, f.feature_en
            )
            SELECT 
                DATE(date) AS date,
                TO_CHAR(date, 'DD.MM.YYYY') AS label_date,
                MAX(CASE WHEN feature_en = 'ref_wikidata' THEN count_per_attribute ELSE 0 END) AS ref_wikidata,
                MAX(CASE WHEN feature_en = 'ref_wikipedia' THEN count_per_attribute ELSE 0 END) AS ref_wikipedia,
                MAX(CASE WHEN feature_en = 'is_domestic' THEN count_per_attribute ELSE 0 END) AS is_domestic,
                MAX(CASE WHEN feature_en = 'use_building_origin' THEN count_per_attribute ELSE 0 END) AS use_building_origin,
                MAX(CASE WHEN feature_en = 'use_building_origin_text' THEN count_per_attribute ELSE 0 END) AS use_building_origin_text,
                MAX(CASE WHEN feature_en = 'use_building_current' THEN count_per_attribute ELSE 0 END) AS use_building_current,
                MAX(CASE WHEN feature_en = 'use_building_current_text' THEN count_per_attribute ELSE 0 END) AS use_building_current_text,
                MAX(CASE WHEN feature_en = 'basement_type' THEN count_per_attribute ELSE 0 END) AS basement_type,
                MAX(CASE WHEN feature_en = 'basement_percentage' THEN count_per_attribute ELSE 0 END) AS basement_percentage,
                MAX(CASE WHEN feature_en = 'basement_use' THEN count_per_attribute ELSE 0 END) AS basement_use,
                MAX(CASE WHEN feature_en = 'basement_use_source' THEN count_per_attribute ELSE 0 END) AS basement_use_source,
                MAX(CASE WHEN feature_en = 'ground_storey_use' THEN count_per_attribute ELSE 0 END) AS ground_storey_use,
                MAX(CASE WHEN feature_en = 'ground_storey_use_source' THEN count_per_attribute ELSE 0 END) AS ground_storey_use_source,
                MAX(CASE WHEN feature_en = 'upper_storeys_use' THEN count_per_attribute ELSE 0 END) AS upper_storeys_use,
                MAX(CASE WHEN feature_en = 'upper_storeys_use_source' THEN count_per_attribute ELSE 0 END) AS upper_storeys_use_source,
                MAX(CASE WHEN feature_en = 'use_number_residential_units' THEN count_per_attribute ELSE 0 END) AS use_number_residential_units,
                MAX(CASE WHEN feature_en = 'use_number_businesses' THEN count_per_attribute ELSE 0 END) AS use_number_businesses,
                MAX(CASE WHEN feature_en = 'building_attachment_form' THEN count_per_attribute ELSE 0 END) AS building_attachment_form,
                MAX(CASE WHEN feature_en = 'size_roof_shape' THEN count_per_attribute ELSE 0 END) AS size_roof_shape,
                MAX(CASE WHEN feature_en = 'size_roof_shape_source' THEN count_per_attribute ELSE 0 END) AS size_roof_shape_source,
                MAX(CASE WHEN feature_en = 'building_owner' THEN count_per_attribute ELSE 0 END) AS building_owner,
                MAX(CASE WHEN feature_en = 'building_owner_source' THEN count_per_attribute ELSE 0 END) AS building_owner_source,
                MAX(CASE WHEN feature_en = 'size_storeys_core' THEN count_per_attribute ELSE 0 END) AS size_storeys_core,
                MAX(CASE WHEN feature_en = 'size_storeys_attic' THEN count_per_attribute ELSE 0 END) AS size_storeys_attic,
                MAX(CASE WHEN feature_en = 'size_storeys_basement' THEN count_per_attribute ELSE 0 END) AS size_storeys_basement,
                MAX(CASE WHEN feature_en = 'size_height_apex' THEN count_per_attribute ELSE 0 END) AS size_height_apex,
                MAX(CASE WHEN feature_en = 'size_floor_area_ground' THEN count_per_attribute ELSE 0 END) AS size_floor_area_ground,
                MAX(CASE WHEN feature_en = 'size_floor_area_total' THEN count_per_attribute ELSE 0 END) AS size_floor_area_total,
                MAX(CASE WHEN feature_en = 'size_width_frontage' THEN count_per_attribute ELSE 0 END) AS size_width_frontage,
                MAX(CASE WHEN feature_en = 'construction_system_type' THEN count_per_attribute ELSE 0 END) AS construction_system_type,
                MAX(CASE WHEN feature_en = 'construction_system_type_source' THEN count_per_attribute ELSE 0 END) AS construction_system_type_source,
                MAX(CASE WHEN feature_en = 'construction_core_material' THEN count_per_attribute ELSE 0 END) AS construction_core_material,
                MAX(CASE WHEN feature_en = 'construction_secondary_materials' THEN count_per_attribute ELSE 0 END) AS construction_secondary_materials,
                MAX(CASE WHEN feature_en = 'construction_roof_covering' THEN count_per_attribute ELSE 0 END) AS construction_roof_covering,
                MAX(CASE WHEN feature_en = 'building_status' THEN count_per_attribute ELSE 0 END) AS building_status,
                MAX(CASE WHEN feature_en = 'building_status_source' THEN count_per_attribute ELSE 0 END) AS building_status_source,
                MAX(CASE WHEN feature_en = 'last_renovation' THEN count_per_attribute ELSE 0 END) AS last_renovation,
                MAX(CASE WHEN feature_en = 'last_renovation_source' THEN count_per_attribute ELSE 0 END) AS last_renovation_source,
                MAX(CASE WHEN feature_en = 'architectural_style' THEN count_per_attribute ELSE 0 END) AS architectural_style,
                MAX(CASE WHEN feature_en = 'architectural_style_source' THEN count_per_attribute ELSE 0 END) AS architectural_style_source,
                MAX(CASE WHEN feature_en = 'date_year' THEN count_per_attribute ELSE 0 END) AS date_year,
                MAX(CASE WHEN feature_en = 'date_lower' THEN count_per_attribute ELSE 0 END) AS date_lower,
                MAX(CASE WHEN feature_en = 'date_upper' THEN count_per_attribute ELSE 0 END) AS date_upper,
                MAX(CASE WHEN feature_en = 'date_source' THEN count_per_attribute ELSE 0 END) AS date_source,
                MAX(CASE WHEN feature_en = 'facade_year' THEN count_per_attribute ELSE 0 END) AS facade_year,
                MAX(CASE WHEN feature_en = 'roof_colour' THEN count_per_attribute ELSE 0 END) AS roof_colour,
                MAX(CASE WHEN feature_en = 'roof_colour_type' THEN count_per_attribute ELSE 0 END) AS roof_colour_type,
                MAX(CASE WHEN feature_en = 'facade_colour' THEN count_per_attribute ELSE 0 END) AS facade_colour,
                MAX(CASE WHEN feature_en = 'thermal_stress_objective' THEN count_per_attribute ELSE 0 END) AS thermal_stress_objective,
                MAX(CASE WHEN feature_en = 'thermal_stress_subjective' THEN count_per_attribute ELSE 0 END) AS thermal_stress_subjective,
                MAX(CASE WHEN feature_en = 'facade_window_percentage' THEN count_per_attribute ELSE 0 END) AS facade_window_percentage,
                MAX(CASE WHEN feature_en = 'direction_of_windows' THEN count_per_attribute ELSE 0 END) AS direction_of_windows,
                MAX(CASE WHEN feature_en = 'heat_adaption_measure' THEN count_per_attribute ELSE 0 END) AS heat_adaption_measure,
                MAX(CASE WHEN feature_en = 'terrain_connection_yesno' THEN count_per_attribute ELSE 0 END) AS terrain_connection_yesno,
                MAX(CASE WHEN feature_en = 'terrain_connection_difference' THEN count_per_attribute ELSE 0 END) AS terrain_connection_difference,
                MAX(CASE WHEN feature_en = 'rain_flood_preventive_measures1' THEN count_per_attribute ELSE 0 END) AS rain_flood_preventive_measures1,
                MAX(CASE WHEN feature_en = 'rain_flood_preventive_measures2' THEN count_per_attribute ELSE 0 END) AS rain_flood_preventive_measures2,
                MAX(CASE WHEN feature_en = 'rain_flood_preventive_measures3' THEN count_per_attribute ELSE 0 END) AS rain_flood_preventive_measures3,
                MAX(CASE WHEN feature_en = 'rain_flood_historic_incidents' THEN count_per_attribute ELSE 0 END) AS rain_flood_historic_incidents,
                MAX(CASE WHEN feature_en = 'heat_adaption_measure_source' THEN count_per_attribute ELSE 0 END) AS heat_adaption_measure_source,
                MAX(CASE WHEN feature_en = 'terrain_connection_difference_source' THEN count_per_attribute ELSE 0 END) AS terrain_connection_difference_source,
                MAX(CASE WHEN feature_en = 'rain_flood_preventive_measures_source' THEN count_per_attribute ELSE 0 END) AS rain_flood_preventive_measures_source
            FROM 
                pivoted_logs
            GROUP BY date
            ORDER BY date DESC;`
        );

        return extractRecords.map(getByDayCoverageAllAttributes);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}

async function service_ByDayCoverageSingleAttribute(field: string): Promise<ByDayCoverageSingleAttribute[]> {
    try {
        const extractRecord = await db.manyOrNone<ByDayCoverageSingleAttribute_Row>(
            `WITH latest_logs AS (
                SELECT
                    f.feature AS merkmal,
                    f.forward_value AS wert,
                    f.user_id,
                    f.log_timestamp,
                    ROW_NUMBER() OVER (
                        PARTITION BY f.building_id
                        ORDER BY f.log_timestamp DESC
                    ) AS rn
                FROM public.mapped_features f
                WHERE f.feature = '${field}'
            ),
            aggregated_logs AS (
                SELECT 
                    DATE(ll.log_timestamp) as log_date,
                    SUM(CASE WHEN u.username LIKE '%_robots' THEN 1 ELSE 0 END) AS anzahl_bulk,
                    SUM(CASE WHEN u.username  NOT LIKE '%_robots' OR u.username IS NULL THEN 1 ELSE 0 END) AS anzahl_citiz
                FROM latest_logs ll
                LEFT JOIN public.users u ON ll.user_id = u.user_id
                WHERE ll.rn = 1 AND ll.wert IS NOT NULL
                GROUP BY DATE(ll.log_timestamp)
            )
            SELECT 
                TO_CHAR(s.day, 'YYYY-MM-DD') AS date,
                TO_CHAR(s.day, 'DD.MM.YYYY') AS label_date,
                COALESCE(al.anzahl_citiz, 0) AS number_mapped_citizens,
                COALESCE(al.anzahl_bulk, 0) AS number_mapped_bulk
            FROM (SELECT generate_series('2023-03-06'::DATE, CURRENT_DATE, '1 day') AS day) s
            LEFT JOIN aggregated_logs al ON s.day = al.log_date
            ORDER BY s.day DESC;`);

        return extractRecord.map(getByDayCoverageSingleAttribute);
    } catch (err) {
        console.error('Error:', err);
        return undefined;
    }
}




function getByDay(er: ByDay_Row): ByDay {
    return {
        date: er.date,
        label: er.label,
        value: er.value
    };
}
function getValueOnly(er: ValueOnly_Row): ValueOnly {
    return {
        value: er.value
    };
}
function getValueCount(er: ValueCount_Row): ValueCount {
    return {
        value: er.value,
        count: er.count
    };
}
function getTimeIntervalCount(er: TimeIntervalCount_Row): TimeIntervalCount {
    return {
        time_interval: er.time_interval,
        label_time_interval: er.label_time_interval,
        count: er.count
    };
}
function getLastEdits(er: LastEdits_Row): LastEdits {
    return {
        date: er.date,
        label_date: er.label_date,
        time: er.time,
        location_latitude: er.location_latitude,
        location_longitude: er.location_longitude,
        city_district: er.city_district,
        time_interval: er.time_interval,
        label_time_interval: er.label_time_interval,
        added_count: er.added_count,
        modified_count: er.modified_count,
        removed_count: er.removed_count,
        total_count: er.total_count
    };
}
function getTopMapperValuesTimeInterval(er: TopMapperValuesTimeInterval_Row): TopMapperValuesTimeInterval {
    return {
        name: er.name,
        number_mapped_attributes: er.number_mapped_attributes,
        time_interval: er.time_interval,
        label_time_interval: er.label_time_interval
    };
}

function getTopFlopAttributesValueLabelCountTimeInterval(er: TopFlopAttributesValueLabelCountTimeInterval_Row): TopFlopAttributesValueLabelCountTimeInterval {
    return {
        attribute: er.attribute,
        label_attribute: er.label_attribute,
        number_mapped_attributes: er.number_mapped_attributes,
        time_interval: er.time_interval,
        label_time_interval: er.label_time_interval
    };
}

function getCoveragePerAttribute(er: CoveragePerAttribute_Row): CoveragePerAttribute {
    return {
        attribute: er.attribute,
        label_attribute: er.label_attribute,
        number_citizens: er.number_citizens,
        number_bulk: er.number_bulk,
        total: er.total 
    };
}

function getByDayCoverageAllAttributes(er: any): ByDayCoverageAllAttributes {
    const base: BaseAllAttributes = {
        date: er.date,
        label_date: er.label_date,
    };

    const attributes = (Object.keys(er) as AttributeKeys[]).reduce((acc, key) => {
        if (key as string !== 'date' && key as string !== 'label_date') {
            acc[key] = er[key];
        }
        return acc;
    }, {} as Record<AttributeKeys, number>);
    
    return { ...base, ...attributes };
}

function getByDayCoverageSingleAttribute(er: ByDayCoverageSingleAttribute_Row): ByDayCoverageSingleAttribute {
    return {
        date: er.date,
        label_date: er.label_date,
        number_mapped_citizens: er.number_mapped_citizens,
        number_mapped_bulk: er.number_mapped_bulk,
    };
}

export {
    service_TodayNumberNewAccounts,
    service_TodayNumberAccountsTotal,
    service_TodayNumberActiveAccounts,
    service_TodayNumberEdits,
    service_TodayNumberMappedAttributes,
    service_ByDayNumberNewAccounts,
    service_ByDayNumberActiveAccounts,
    service_ByDayNumberEdits,
    service_ByDayNumberMappedAttributes,
    service_HistogramByAttribute,
    service_TickerNumberNewAccounts,
    service_TickerNumberActiveAccounts,
    service_TickerNumberEdits,
    service_TickerNumberMappedAttributes,
    service_TickerLastEdits,
    service_TickerTopMapper,
    service_TickerTopAttributes,
    service_TickerFlopAttributes,
    service_CoveragePerAttribute,
    service_CoveragePerCityDistrictGEOJSON,
    service_ByDayNumberEditsCitizens,
    service_ByDayNumberAttributesCitizens,
    service_ByDayNumberAddedAttributesCitizens,
    service_ByDayNumberModifiedAttributesCitizens,
    service_ByDayNumberRemovedAttributesCitizens,
    service_ByDayNumberVerificationsCitizens,
    service_ByDayNumberAddedAttributesBulk,
    service_ByDayNumberModifiedAttributesBulk,
    service_ByDayCoverageAllAttributes,
    service_ByDayCoverageSingleAttribute
};