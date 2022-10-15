const express = require('express');
const {retrieveSharedChart } = require('../controllers/chartController');

const router = express.Router();

router.post('/retrieveShared', retrieveSharedChart);

router.get('/', (req, res) => {
    res.render("chart", {});
});

router.get('/:id', (req, res, next) => {
    if (typeof req.params.id != 'undefined' && /^[0-9A-Fa-f]{16,32}$/.test(req.params.id)) {
        res.render("chart", {});
    } else {
        next();
    }
});

module.exports = router;