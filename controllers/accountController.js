const User = require("../models/User");
const Validator = require("../utils/validator");
const bcrypt = require("bcrypt");

const accountView = (req, res) => {
    let user = req.session.user;
    res.render("account", { "email": user.email, "firstName": user.firstName, "lastName": user.lastName });
}

const changeName = (req, res) => {
    const { firstName, lastName, password } = req.body;
    if (!firstName || !lastName || !password) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    if (!Validator.validate('password', password)) {
        res.json({ 'success': false, 'reason': 'Invalid password' });
        return;
    }
    if (!Validator.validate('name', firstName)) {
        res.json({ 'success': false, 'reason': 'Invalid first name' });
        return;
    }
    if (!Validator.validate('name', lastName)) {
        res.json({ 'success': false, 'reason': 'Invalid last name' });
        return;
    }
    let user = req.session.user;
    bcrypt.compare(password, user.password).then(matching => {
        if (matching) {
            user.firstName = firstName;
            user.lastName = lastName;
            User.findOneAndUpdate({ email: user.email, active: true }, { firstName: firstName, lastName: lastName }).then(oldUser => {
                if (oldUser) res.json({ 'success': true });
                else res.json({ 'success': false });
            }).catch(err => {
                console.log(err);
                res.json({ 'success': false });
            });
        } else {
            res.json({ 'success': false, reason: 'Invalid password' });
        }
    }).catch(err => {
        console.log(err);
        res.json({ 'success': false });
    });
};

const changePasswd = (req, res) => {
    const { curPassword, newPassword } = req.body;
    if (!curPassword || !newPassword) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    if (!Validator.validate('password', curPassword)) {
        res.json({ 'success': false, 'reason': 'Invalid current password' });
        return;
    }
    if (!Validator.validate('password', newPassword)) {
        res.json({ 'success': false, 'reason': 'Invalid new password' });
        return;
    }
    let user = req.session.user;
    bcrypt.compare(curPassword, user.password).then(matching => {
        if (matching) {
            bcrypt.hash(newPassword, 12).then(hash => {
                user.password = hash;
                User.findOneAndUpdate({ email: user.email, active: true }, { password: hash }).then(newUser => {
                    res.json({ 'success': true });
                }).catch(err => {
                    console.log(err);
                    res.json({ 'success': false });
                });
            }).catch(err => {
                console.log(err);
                res.json({ 'success': false });
            });
        } else {
            res.json({ 'success': false, reason: 'Invalid current password' });
        }
    }).catch(err => {
        console.log(err);
        res.json({ 'success': false });
    });
};

const deleteAccount = (req, res) => {
    const { password } = req.body;
    if (!password) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    let user = req.session.user;
    bcrypt.compare(password, user.password).then(matching => {
        if (matching) {
            User.updateMany({ email: user.email, active: true }, { active: false }).then(users => {
                req.session.loggedIn = false;
                req.session.user = null;
                res.json({ 'success': true });
            }).catch(err => {
                console.log(err);
                res.json({ 'success': false });
            });
        } else {
            res.json({ 'success': false, reason: 'Invalid password' });
        }
    }).catch(err => {
        console.log(err);
        res.json({ 'success': false });
    });
};

module.exports = { accountView, changeName, changePasswd, deleteAccount };
