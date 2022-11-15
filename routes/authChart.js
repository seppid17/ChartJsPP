const express = require('express');
const { saveChart, retrieveChart, getChartList, deleteChart, shareChart, unshareChart } = require('../controllers/chartController');
const wrap = require('../utils/controllerWrapper');
const router = express.Router();

router.post('/save/', wrap(saveChart));
router.post('/retrieve', wrap(retrieveChart));
router.post('/list', wrap(getChartList));
router.post('/delete', wrap(deleteChart));
router.post('/share', wrap(shareChart));
router.post('/unshare', wrap(unshareChart));

module.exports = router;