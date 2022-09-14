const express = require('express');
const { changeName, changePasswd, deleteAccount } = require('../controllers/accountController');
const router = express.Router();
router.get('/', (req, res) => {
    let user = req.session.user;
    res.render("account", { "firstName": user.firstName, "lastName": user.lastName });
});
router.post('/name', changeName);
router.post('/password', changePasswd);
router.post('/delete', deleteAccount);

module.exports = router;