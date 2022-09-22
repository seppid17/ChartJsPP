const express = require('express');
const { loginView, logout, loginUser } = require('../controllers/loginController');
const router = express.Router();
router.get('/', (req, res) => {
    res.render("home", {});
});
router.get('/logout', logout);
router.all('/login', (req, res, next) => {
    if (req.session.loggedIn === true && req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
})
router.get('/login', loginView);
router.post('/login', loginUser);

module.exports = router;