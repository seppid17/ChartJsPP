const express = require('express');
const { accountView, changeName, changePasswd, deleteAccount } = require('../controllers/accountController');
const wrap = require('../utils/controllerWrapper');
const router = express.Router();

router.get('/', wrap(accountView));
router.post('/name', wrap(changeName));
router.post('/password', wrap(changePasswd));
router.post('/delete', wrap(deleteAccount));

module.exports = router;