const { User, SignupRequest } = require("../models/User");
const bcrypt = require("bcrypt");

const changePasswd = (req, res) => {
    const { curPassword, newPassword } = req.body;
    if (!curPassword || !newPassword) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason':'Some required fields are empty' });
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
        res.json({ 'success': false, 'reason':'Some required fields are empty' });
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

module.exports = { changePasswd, deleteAccount }