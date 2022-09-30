const express = require('express');
const { saveChart } = require('../controllers/chartController');
const router = express.Router();

router.post('/save/', saveChart);

module.exports = router;