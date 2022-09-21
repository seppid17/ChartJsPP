const express = require('express');
const router = express.Router();
router.get(/.*/, (req, res, next) => {
    if (req.session.loggedIn===true && req.session.user) {
        next();
    } else {
        req.session.target = req.url;
        res.redirect('/login');
    }
});
router.all(/.*/, (req, res, next) => {
    if (req.session.loggedIn===true && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
});
module.exports = router;