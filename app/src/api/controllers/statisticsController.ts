import express from 'express';

import { parsePositiveIntParam, processParam, checkRegexParam, checkParamByAllowList } from '../parameters';
import asyncController from '../routes/asyncController';
import * as statisticsService from '../services/statistics';

const createAsyncHandler = (serviceFunction) =>
    asyncController(async (req: express.Request, res: express.Response) => {
        try {
            const dataObj = await serviceFunction();
            res.send({ data: dataObj });
        } catch (err) {
            res.send({ error: 'Database error' });
        }
    });

export default {
    getTodayNumberNewAccounts: createAsyncHandler(statisticsService.service_TodayNumberNewAccounts),
    getTodayNumberAccountsTotal: createAsyncHandler(statisticsService.service_TodayNumberAccountsTotal),
    getTodayNumberActiveAccounts: createAsyncHandler(statisticsService.service_TodayNumberActiveAccounts),
    getTodayNumberEdits: createAsyncHandler(statisticsService.service_TodayNumberEdits),
    getTodayNumberMappedAttributes: createAsyncHandler(statisticsService.service_TodayNumberMappedAttributes),
    getByDayNumberNewAccounts: createAsyncHandler(statisticsService.service_ByDayNumberNewAccounts),
    getByDayNumberActiveAccounts: createAsyncHandler(statisticsService.service_ByDayNumberActiveAccounts),
    getByDayNumberEdits: createAsyncHandler(statisticsService.service_ByDayNumberEdits),
    getByDayNumberMappedAttributes: createAsyncHandler(statisticsService.service_ByDayNumberMappedAttributes),
    getTickerNumberNewAccounts: createAsyncHandler(statisticsService.service_TickerNumberNewAccounts),
    getTickerNumberActiveAccounts: createAsyncHandler(statisticsService.service_TickerNumberActiveAccounts),
    getTickerNumberEdits: createAsyncHandler(statisticsService.service_TickerNumberEdits),
    getTickerNumberMappedAttributes: createAsyncHandler(statisticsService.service_TickerNumberMappedAttributes),
    getTickerLastEdits: createAsyncHandler(statisticsService.service_TickerLastEdits),
    getTickerTopMapper: createAsyncHandler(statisticsService.service_TickerTopMapper),
    getTickerTopAttributes: createAsyncHandler(statisticsService.service_TickerTopAttributes),
    getTickerFlopAttributes: createAsyncHandler(statisticsService.service_TickerFlopAttributes),
    getCoveragePerAttribute: createAsyncHandler(statisticsService.service_CoveragePerAttribute),
    /* getCoveragePerCityDistrictGEOJSON: createAsyncHandler(statisticsService.service_CoveragePerCityDistrictGEOJSON), */
    getByDayNumberEditsCitizens: createAsyncHandler(statisticsService.service_ByDayNumberEditsCitizens),
    getByDayNumberAttributesCitizens: createAsyncHandler(statisticsService.service_ByDayNumberAttributesCitizens),
    getByDayNumberAddedAttributesCitizens: createAsyncHandler(statisticsService.service_ByDayNumberAddedAttributesCitizens),
    getByDayNumberModifiedAttributesCitizens: createAsyncHandler(statisticsService.service_ByDayNumberModifiedAttributesCitizens),
    getByDayNumberRemovedAttributesCitizens: createAsyncHandler(statisticsService.service_ByDayNumberRemovedAttributesCitizens),
    getByDayNumberVerificationsCitizens: createAsyncHandler(statisticsService.service_ByDayNumberVerificationsCitizens),
    getByDayNumberAddedAttributesBulk: createAsyncHandler(statisticsService.service_ByDayNumberAddedAttributesBulk),
    getByDayNumberModifiedAttributesBulk: createAsyncHandler(statisticsService.service_ByDayNumberModifiedAttributesBulk),
    getByDayCoverageAllAttributes: createAsyncHandler(statisticsService.service_ByDayCoverageAllAttributes),

    getHistogramByAttribute: asyncController(async function(req: express.Request, res: express.Response) {
        /* allowList for allowed fieldnames as parameter for this API endpoint */
        let allowed_fieldnames: string[] = ['date_year', 'facade_year', 'size_storeys_attic', 'size_storeys_core', 'size_storeys_basement', 'building_attachment_form', 'construction_core_material', 'construction_secondary_materials', 'construction_roof_covering', 'is_domestic', 'use_building_origin', 'use_building_current', 'basement_type', 'basement_percentage', 'basement_use', 'ground_storey_use', 'upper_storeys_use', 'use_number_residential_units', 'use_number_businesses', 'building_status', 'last_renovation', 'construction_system_type', 'size_roof_shape', 'building_owner', 'architectural_style'];

        /* first: check input param with regex */
        /* second: check input param if string is in allowlist for fieldnames */
        /* RegEx: only letters and underline are allowed */
        const fieldRegex = /^[A-Za-z_]+$/;
        const field = checkParamByAllowList(processParam(req.params, 'field', x => checkRegexParam(x, fieldRegex)), allowed_fieldnames);

        try {
            const dataObj = await statisticsService.service_HistogramByAttribute(field);
            res.send({ data: dataObj });
        } catch (err) {
            res.send({ error: 'Database error' });
        }
    }),

    getByDayCoverageSingleAttribute: asyncController(async function(req: express.Request, res: express.Response) {
        let allowed_fieldnames: string[] = ['date_year', 'facade_year', 'size_storeys_attic', 'size_storeys_core', 'size_storeys_basement', 'building_attachment_form', 'construction_core_material', 'construction_secondary_materials', 'construction_roof_covering', 'is_domestic', 'use_building_origin', 'use_building_current', 'basement_type', 'basement_percentage', 'basement_use', 'ground_storey_use', 'upper_storeys_use', 'use_number_residential_units', 'use_number_businesses', 'building_status', 'last_renovation', 'construction_system_type', 'size_roof_shape', 'building_owner', 'architectural_style'];

        const fieldRegex = /^[A-Za-z_]+$/;
        const field = checkParamByAllowList(processParam(req.params, 'field', x => checkRegexParam(x, fieldRegex)), allowed_fieldnames);
    
        try {
            const dataObj = await statisticsService.service_ByDayCoverageSingleAttribute(field);
            res.send({ data: dataObj });
        } catch (err) {
            res.send({ error: 'Database error' });
        }
    })
};