const express = require('express');
const { loginView, logout, loginUser } = require('../controllers/loginController');
const wrap = require('../utils/controllerWrapper');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("home", {nonce: req.scriptNonce});
});
router.get('/logout', wrap(logout));
router.all('/login', (req, res, next) => {
    if (req.session.loggedIn === true && req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
})
router.get('/login', wrap(loginView));
router.post('/login', wrap(loginUser, 15000));

module.exports = router;