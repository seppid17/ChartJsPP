const User = require("../models/User");
const Validator = require("../utils/validator");
const bcrypt = require("bcrypt");

const loginView = (req, res) => {
    res.render("login", {});
}

const logout = (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect('/');
}

const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    if (!Validator.validate('email', email)) {
        res.json({ 'success': false, 'reason': 'Invalid email' });
        return;
    }
    if (!Validator.validate('password', password)) {
        res.json({ 'success': false, 'reason': 'Invalid password' });
        return;
    }
    User.findOne({ email: email, active: true }).then((user) => {
        if (!user) {
            console.log("email does not exist");
            res.json({ 'success': false, 'reason': 'This email does not have an account' });
            return;
        }
        bcrypt.compare(password, user.password).then(matching => {
            if (matching) {
                req.session.loggedIn = true;
                req.session.user = user;
                let response = { 'success': true };
                if ((typeof req.session.target == "string") && req.session.target != '') {
                    response['target'] = req.session.target;
                    req.session.target = null;
                }
                res.json(response);
            } else {
                res.json({ 'success': false, 'reason': 'Incorrect password' });
            }
        }).catch(err => {
            console.log(err);
            res.json({ 'success': false });
        });
    }).catch(err => {
        console.log(err);
        res.json({ 'success': false });
    });
};

module.exports = { loginView, logout, loginUser };