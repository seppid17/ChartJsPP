const express = require('express');
const { saveChart, retrieveChart, getChartList, deleteChart, shareChart } = require('../controllers/chartController');
const router = express.Router();

router.post('/save/', saveChart);
router.post('/retrieve', retrieveChart);
router.post('/list', getChartList);
router.post('/delete', deleteChart);
router.post('/share', shareChart);

module.exports = router;