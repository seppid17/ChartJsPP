const express = require('express');
const { saveChart, retrieveChart, getChartList, deleteChart } = require('../controllers/chartController');
const router = express.Router();

router.post('/save/', saveChart);
router.get('/retrieve/:id', (req, res) => {
    res.render("chart", {});
});
router.post('/retrieve', retrieveChart);
router.post('/list', getChartList);
router.post('/delete', deleteChart);

module.exports = router;