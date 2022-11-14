const express = require('express');
const { retrieveSharedChart } = require('../controllers/chartController');
const wrap = require('../utils/controllerWrapper');

const router = express.Router();

router.post('/retrieveShared', wrap(retrieveSharedChart));

router.get('/', (req, res) => {
    res.render("chart", {nonce: req.scriptNonce});
});

router.get('/:id', (req, res, next) => {
    if (typeof req.params.id != 'undefined' && /^[0-9A-Fa-f]{16,32}$/.test(req.params.id)) {
        res.render("chart", {nonce: req.scriptNonce});
    } else {
        next();
    }
});

module.exports = router;