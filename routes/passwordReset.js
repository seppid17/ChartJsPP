const express = require('express');
const { forgotPasswordView, resetPasswordView, forgotPassword, resetPassword } = require('../controllers/passwordResetController');
const router = express.Router();

router.get('/forgotPassword', forgotPasswordView);
router.get(/\/resetPassword\/.*\/.*/, resetPasswordView);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:email/:token', resetPassword);

module.exports = router;