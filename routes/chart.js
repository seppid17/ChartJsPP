const express = require('express');
const router = express.Router();
router.get(/^\/(?:[0-9A-Za-z]{16,32})?$/, (req, res) => {
    res.render("chart", {});
});

module.exports = router;