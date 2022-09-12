const express = require('express');
const { signupView, loginView, activateView, requestUser, loginUser, activateAccount } = require('../controllers/loginController');
const router = express.Router();
router.get('/', (req, res) => {
    res.render("home", {});
});
router.get('/logout', (req, res) => {
    req.session.loggedIn = false;
    req.session.user = false;
    res.redirect('/');
});
router.get('/login', loginView);
router.get('/signup', signupView);
router.get(/\/activate\/.*\/.*/, activateView);
router.post('/login', loginUser);
router.post('/signup', requestUser);
router.post('/activate/:email/:token', activateAccount);
router.get('/test', (req, res) => {
    let msg= req.path;
    res.json(msg);
});
module.exports = router;