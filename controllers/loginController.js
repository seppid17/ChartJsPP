const User = require("../models/User");
const Validator = require("../utils/validator");
const bcrypt = require("bcrypt");

const loginView = (req, res) => {
    res.render("login", {nonce: req.scriptNonce});
}

const logout = (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect('/');
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.json({ 'success': false, 'reason': 'Email cannot be empty', 'field': 'email' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.json({ 'success': false, 'reason': 'Invalid email format', 'field': 'email' });
            return;
        }
        if (!password) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'password' });
            return;
        }
        if (!Validator.validate('password', password)) {
            res.json({ 'success': false, 'reason': 'Invalid password format', 'field': 'password' });
            return;
        }
        let user = await User.findOne({ email: email, active: true });
        if (!user) {
            res.json({ 'success': false, 'reason': 'This email does not have an account', 'field': 'email' });
            return;
        }
        let matching = await bcrypt.compare(password, user.password);
        if (matching === true) {
            req.session.loggedIn = true;
            req.session.user = user;
            let response = { 'success': true };
            if ((typeof req.session.target == "string") && req.session.target != '') {
                response['target'] = req.session.target;
                req.session.target = null;
            }
            res.json(response);
        } else {
            res.json({ 'success': false, 'reason': 'Incorrect password', 'field': 'password' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

module.exports = { loginView, logout, loginUser };