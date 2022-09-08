const express = require('express');
const {signupView, loginView, addUser } = require('../controllers/loginController');
const router = express.Router();
router.get('/', (req, res) => {
    res.render("home", {});
});
router.get('/login', loginView);
router.get('/signup', signupView);
router.post('/signup', addUser);
module.exports = router;