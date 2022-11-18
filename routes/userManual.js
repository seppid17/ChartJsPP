const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("userManual", {nonce: req.scriptNonce});
});

module.exports = router;