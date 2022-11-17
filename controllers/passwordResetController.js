const User = require("../models/User");
const ResetPasswordRequest = require("../models/ResetPassword");
const Mailer = require("../utils/mail");
const Validator = require("../utils/validator");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const forgotPasswordView = (req, res) => {
    res.render("forgotPassword", {nonce: req.scriptNonce});
}

const resetPasswordView = (req, res) => {
    res.render("resetPassword", {nonce: req.scriptNonce});
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.json({ 'success': false, 'reason': "Email cannot be empty.", 'field': 'email' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.json({ 'success': false, 'reason': 'Invalid email format', 'field': 'email' });
            return;
        }
        let user = await User.findOne({ email: email, active: true });
        if (!user) {
            res.json({ 'success': false, 'reason': "This email does not have an account.", 'field': 'email' });
            return;
        }
        let token = crypto.randomBytes(16).toString('hex');
        let timestamp = Math.floor(Date.now() / 1000) + 900;
        const resetPasswordRequest = new ResetPasswordRequest({
            email: email,
            token: token,
            expiry: timestamp,
            used: false
        });
        //Password Hashing
        await resetPasswordRequest.save();
        const proxyHost = req.headers["x-forwarded-host"];
        const host = proxyHost ? proxyHost : req.headers.host;
        let link = req.protocol + '://' + host + '/resetPassword/' + email + '/' + token;
        try {
            await Mailer.sendMail('resetPassword', email, link);
            res.json({ 'success': true });
        } catch (error) {
            console.log(error);
            res.json({ 'success': false, 'reason': 'Email sending failed! Try again later.' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { email, token } = req.params;
        if (!email || !token) {
            res.json({ 'success': false, 'reason': 'Some required fields are empty' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.json({ 'success': false, 'reason': 'Invalid email format.' });
            return;
        }
        if (!Validator.validate('token', token)) {
            res.json({ 'success': false, 'reason': 'Invalid token.' });
            return;
        }
        if (!password) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty.', 'field': 'password' });
            return;
        }
        if (!Validator.validate('password', password)) {
            res.json({ 'success': false, 'reason': 'Invalid password format', 'field': 'password' });
            return;
        }
        let resetPasswordRequest = await ResetPasswordRequest.findOne({ email: email, token: token, used: false });
        if (!resetPasswordRequest) {
            res.json({ 'success': false, 'reason': 'Password reset failed! Invalid token.' });
            return;
        }
        let timestampNow = Math.floor(Date.now() / 1000);
        if (resetPasswordRequest.expiry < timestampNow) {
            res.json({ 'success': false, 'reason': 'Password reset failed! Token is expired.' });
            return;
        }
        let hash = await bcrypt.hash(password, 12);
        if (!hash) {
            throw 'hashing error';
        }
        resetPasswordRequest.used = true;
        await resetPasswordRequest.save();
        let user = await User.findOneAndUpdate({ email: email, active: true }, { password: hash });
        if (!user) {
            throw 'Update user error';
        }
        res.json({ 'success': true });
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

module.exports = { forgotPasswordView, resetPasswordView, forgotPassword, resetPassword };