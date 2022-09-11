const { User, SignupRequest } = require("../models/User");
const bcrypt = require("bcrypt");

const changePasswd = (req, res) => {
    const { curPassword, newPassword } = req.body;
    if (!curPassword || !newPassword) {
        console.log("Fill empty fields");
        res.json({ 'success': false });
        return;
    }
    let user = req.session.user;
    bcrypt.compare(curPassword, user.password).then(matching => {
        if (matching) {
            bcrypt.hash(newPassword, 12).then(hash => {
                user.password = hash;
                User.findOneAndUpdate({ email: user.email, active: true }, user).then(newUser => {
                    req.session.user = newUser;
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

module.exports = { changePasswd }