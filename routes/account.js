const express = require('express');
const { accountView, changeName, changePasswd, deleteAccount } = require('../controllers/accountController');
const router = express.Router();
router.get('/', accountView);
router.post('/name', changeName);
router.post('/password', changePasswd);
router.post('/delete', deleteAccount);

module.exports = router;