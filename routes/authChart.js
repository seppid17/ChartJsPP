const express = require('express');
const { saveChart, retrieveChart, getChartList, deleteChart } = require('../controllers/chartController');
const router = express.Router();

router.post('/save/', saveChart);
router.post('/retrieve', retrieveChart);
router.post('/list', getChartList);
router.post('/delete', deleteChart);

router.get('/:id', (req, res, next) => {
    if (typeof req.params.id != 'undefined' && /^[0-9A-Fa-f]{16,32}$/.test(req.params.id)) {
        res.render("chart", {});
    } else {
        next();
    }
});

module.exports = router;