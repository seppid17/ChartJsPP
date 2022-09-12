const express = require('express');
const { changePasswd, deleteAccount } = require('../controllers/accountController');
const router = express.Router();
router.get('/', (req, res) => {
    res.render("account", {});
});
router.post('/password', changePasswd);
router.post('/delete', deleteAccount);

module.exports = router;