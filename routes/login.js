const express = require('express');
const { signupView, loginView, requestUser, loginUser } = require('../controllers/loginController');
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
router.post('/login', loginUser);
router.post('/signup', requestUser);
module.exports = router;