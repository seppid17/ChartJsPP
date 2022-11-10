const express = require('express');
const { forgotPasswordView, resetPasswordView, forgotPassword, resetPassword } = require('../controllers/passwordResetController');
const wrap = require('../utils/controllerWrapper');
const router = express.Router();

router.get('/forgotPassword', wrap(forgotPasswordView));
router.get(/\/resetPassword\/.*\/.*/, wrap(resetPasswordView));
router.post('/forgotPassword', wrap(forgotPassword, 15000));
router.post('/resetPassword/:email/:token', wrap(resetPassword));

module.exports = router;