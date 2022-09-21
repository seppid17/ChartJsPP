const express = require('express');
const { signupView, activateView, requestUser, activateAccount } = require('../controllers/signupController');
const router = express.Router();

router.get('/signup', signupView);
router.get(/\/activate\/.*\/.*/, activateView);
router.post('/signup', requestUser);
router.post('/activate/:email/:token', activateAccount);

module.exports = router;