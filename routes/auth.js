const express = require('express');
const router = express.Router();

// api function to check if the user is logged in
router.all('/isLogged', (req, res) => {
    if (req.session.loggedIn === true && req.session.user) {
        let user = req.session.user;
        res.json({ logged: true, email: user.email, firstName: user.firstName, lastName: user.lastName });
    } else {
        res.json({ logged: false });
    }
});

// if not logged in, save the target and redirect to login
router.get(/.*/, (req, res, next) => {
    if (req.session.loggedIn === true && req.session.user) {
        next();
    } else {
        req.session.target = req.url;
        res.redirect('/login');
    }
});

// if not logged in, send Unauthorized
router.all(/.*/, (req, res, next) => {
    if (req.session.loggedIn === true && req.session.user) {
        next();
    } else {
        res.json({ reason: 'Unauthorized' });
    }
});

module.exports = router;