const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let user = req.session.user;
    res.render("dashboard", { firstName: user.firstName, lastName: user.lastName, nonce: req.scriptNonce });
});

module.exports = router;