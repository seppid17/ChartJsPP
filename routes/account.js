const express = require('express');
const { changePasswd } = require('../controllers/accountController');
const router = express.Router();
router.get('/', (req, res) => {
    res.render("account", {});
});
router.post('/', changePasswd);

module.exports = router;