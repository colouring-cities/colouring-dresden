import express from 'express';

import statisticsController from '../controllers/statisticsController';

const router = express.Router();

/* router.get('/', statisticsController.getAllDataExtracts); */
/* router.get('/:extract_id', statisticsController.getDataExtract); */
router.get('/today/number_new_accounts', statisticsController.getTodayNumberNewAccounts);
router.get('/today/number_accounts_total', statisticsController.getTodayNumberAccountsTotal);
router.get('/today/number_active_accounts', statisticsController.getTodayNumberActiveAccounts);
router.get('/today/number_edits', statisticsController.getTodayNumberEdits);
router.get('/today/number_mapped_attributes', statisticsController.getTodayNumberMappedAttributes);
router.get('/by_day/number_new_accounts', statisticsController.getByDayNumberNewAccounts);
router.get('/by_day/number_active_accounts', statisticsController.getByDayNumberActiveAccounts);
router.get('/by_day/number_edits', statisticsController.getByDayNumberEdits);
router.get('/by_day/number_mapped_attributes', statisticsController.getByDayNumberMappedAttributes);
router.get('/histogram/by_attribute/:field', statisticsController.getHistogramByAttribute);

router.get('/ticker/number_new_accounts', statisticsController.getTickerNumberNewAccounts);
router.get('/ticker/number_active_accounts', statisticsController.getTickerNumberActiveAccounts);
router.get('/ticker/number_edits', statisticsController.getTickerNumberEdits);
router.get('/ticker/number_mapped_attributes', statisticsController.getTickerNumberMappedAttributes);
router.get('/ticker/last_edits', statisticsController.getTickerLastEdits);
router.get('/ticker/top_mapper', statisticsController.getTickerTopMapper);
router.get('/ticker/top_attributes', statisticsController.getTickerTopAttributes);
router.get('/ticker/flop_attributes', statisticsController.getTickerFlopAttributes);
router.get('/coverage/per_attribute', statisticsController.getCoveragePerAttribute);
/* router.get('coverage/per_city_district.geojson', statisticsController.getCoveragePerCityDistrictGEOJSON); */
router.get('/by_day/number_edits_citizens', statisticsController.getByDayNumberEditsCitizens);
router.get('/by_day/number_attributes_citizens', statisticsController.getByDayNumberAttributesCitizens);
router.get('/by_day/number_added_attributes_citizens', statisticsController.getByDayNumberAddedAttributesCitizens);
router.get('/by_day/number_modified_attributes_citizens', statisticsController.getByDayNumberModifiedAttributesCitizens);
router.get('/by_day/number_removed_attributes_citizens', statisticsController.getByDayNumberRemovedAttributesCitizens);
router.get('/by_day/number_verifications_citizens', statisticsController.getByDayNumberVerificationsCitizens);
router.get('/by_day/number_added_attributes_bulk', statisticsController.getByDayNumberAddedAttributesBulk);
router.get('/by_day/number_modified_attributes_bulk', statisticsController.getByDayNumberModifiedAttributesBulk);
router.get('/by_day/coverage_attribute/:field', statisticsController.getByDayCoverageSingleAttribute);
router.get('/by_day/coverage_all_attributes', statisticsController.getByDayCoverageAllAttributes);


export default router;
