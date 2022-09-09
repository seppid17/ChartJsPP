const express = require('express');
const router = express.Router();
router.all(/.*/, (req, res, next) => {
    if (req.session.loggedIn && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
});
module.exports = router;