const express = require('express');
const { saveChart, retrieveChart, getChartList } = require('../controllers/chartController');
const router = express.Router();

router.post('/save/', saveChart);
router.get('/retrieve/:id', (req, res) => {
    res.render("chart", {});
});
router.post('/retrieve', retrieveChart);
router.post('/list', getChartList);

module.exports = router;