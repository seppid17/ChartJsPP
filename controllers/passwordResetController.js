const User = require("../models/User");
const ResetPasswordRequest = require("../models/ResetPassword");
const Mailer = require("../utils/mail");
const Validator = require("../utils/validator");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const forgotPasswordView = (req, res) => {
    res.render("forgotPassword", {});
}

const resetPasswordView = (req, res) => {
    res.render("resetPassword", {});
}

const forgotPassword = (req, res) => {
    const { email } = req.body;
    if (!email) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': "Email cannot be empty.", 'field': 'email' });
        return;
    }
    User.findOne({ email: email, active: true }).then(user => {
        if (!user) {
            console.log("email does not exist");
            res.json({ 'success': false, 'reason': "This email does not exist.", 'field': 'email' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.json({ 'success': false, 'reason': 'Invalid email format', 'field': 'email' });
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
        resetPasswordRequest.save()
            .then(() => {
                const proxyHost = req.headers["x-forwarded-host"];
                const host = proxyHost ? proxyHost : req.headers.host;
                let link = req.protocol + '://' + host + '/resetPassword/' + email + '/' + token;
                Mailer.sendMail("resetPassword", email, link, (error, info) => {
                    if (error) {
                        console.log(error);
                        res.json({ 'success': false, 'reason': 'Email sending failed! Try again later.' });
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.json({ 'success': true });
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                res.json({ 'success': false });
            });
    }).catch(err => {
        console.log(err);
        res.json({ 'success': false });
    });
};

const resetPassword = (req, res) => {
    const { password } = req.body;
    const { email, token } = req.params;
    if (!email || !token) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    if (!password) {
        res.json({ 'success': false, 'reason': 'Password cannot be empty.', 'field': 'password' });
        return;
    }
    if (!Validator.validate('email', email)) {
        res.json({ 'success': false, 'reason': 'Invalid email format.' });
        return;
    }
    if (!Validator.validate('password', password)) {
        res.json({ 'success': false, 'reason': 'Invalid password format', 'field': 'password'  });
        return;
    }
    if (!Validator.validate('token', token)) {
        res.json({ 'success': false, 'reason': 'Invalid token.' });
        return;
    }
    ResetPasswordRequest.findOne({ email: email, token: token, used: false }).then((resetPasswordRequest) => {
        if (!resetPasswordRequest) {
            console.log("invalid or expired token");
            res.json({ 'success': false, 'reason': 'Password reset failed! Invalid token.' });
            return;
        }
        let timestampNow = Math.floor(Date.now() / 1000);
        if (resetPasswordRequest.expiry < timestampNow) {
            console.log("expired");
            res.json({ 'success': false, 'reason': 'Password reset failed! Token is expired.' });
            return;
        }
        bcrypt.hash(password, 12, (err, hash) => {
            if (err) throw err;
            resetPasswordRequest.used = true;
            resetPasswordRequest.save()
                .then(() => {
                    User.findOneAndUpdate({ email: email, active: true }, { password: hash }, (err, user) => {
                        if (err || !user) {
                            console.log(err);
                            res.json({ 'success': false });
                            return;
                        }
                        console.log('success');
                        res.json({ 'success': true });
                    });
                }).catch(err => {
                    console.log(err);
                    res.json({ 'success': false });
                });
        });
    }).catch(err => {
        console.log(err);
        res.json({ 'success': false });
    });
};

module.exports = { forgotPasswordView, resetPasswordView, forgotPassword, resetPassword };