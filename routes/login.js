const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();
router.get('/', (req, res) => {
    res.render("home", {});
});
router.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect('/');
});
router.get('/login', loginController.loginView);
router.get('/signup', loginController.signupView);
router.get(/\/activate\/.*\/.*/, loginController.activateView);
router.get('/forgotPassword', loginController.forgotPasswordView);
router.get(/\/resetPassword\/.*\/.*/, loginController.resetPasswordView);
router.post('/login', loginController.loginUser);
router.post('/signup', loginController.requestUser);
router.post('/activate/:email/:token', loginController.activateAccount);
router.post('/forgotPassword', loginController.forgotPassword);
router.post('/resetPassword/:email/:token', loginController.resetPassword);

module.exports = router;