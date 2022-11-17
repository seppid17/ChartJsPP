const express = require('express');
const { signupView, activateView, requestUser, activateAccount } = require('../controllers/signupController');
const wrap = require('../utils/controllerWrapper');
const router = express.Router();

router.get('/signup', wrap(signupView));
router.get(/\/activate\/.*\/.*/, wrap(activateView));
router.post('/signup', wrap(requestUser, 20000));
router.post('/activate/:email/:token', wrap(activateAccount, 15000));

module.exports = router;