const express = require('express');
const { accountView, changeName, changePasswd, deleteAccount } = require('../controllers/accountController');
const wrap = require('../utils/controllerWrapper');
const router = express.Router();

router.get('/', wrap(accountView));
router.post('/name', wrap(changeName, 15000));
router.post('/password', wrap(changePasswd, 20000));
router.post('/delete', wrap(deleteAccount, 20000));

module.exports = router;