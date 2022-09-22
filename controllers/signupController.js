const User = require("../models/User");
const SignupRequest = require("../models/SignupRequest");
const Mailer = require("../utils/mail");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const signupView = (req, res) => {
    res.render("signup", {});
}

const activateView = (req, res) => {
    res.render("activate", {});
}

const requestUser = (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    User.findOne({ email: email, active: true }).then(user => {
        if (user) {
            console.log("email exists");
            res.json({ 'success': false, 'reason': "This email already exists" });
            return;
        }
        let token = crypto.randomBytes(16).toString('hex');
        let timestamp = Math.floor(Date.now() / 1000) + 3600;
        const signupRequest = new SignupRequest({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            token: token,
            expiry: timestamp,
            used: false
        });
        //Password Hashing
        bcrypt.hash(signupRequest.password, 12, (err, hash) => {
            if (err) throw err;
            signupRequest.password = hash;
            signupRequest.save()
                .then(() => {
                    const proxyHost = req.headers["x-forwarded-host"];
                    const host = proxyHost ? proxyHost : req.headers.host;
                    let link = req.protocol + '://' + host + '/activate/' + email + '/' + token;
                    Mailer.sendMail("activate", email, link, (error, info) => {
                        if (error) {
                            console.log(error);
                            res.json({ 'success': false, 'reason': 'Error sending email' });
                        } else {
                            // console.log('Email sent: ' + info.response);
                            res.json({ 'success': true });
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ 'success': false });
                });
        });
    }).catch(err => {
        console.log(err);
        res.json({ 'success': false });
    });
};

const activateAccount = (req, res) => {
    const { password } = req.body;
    const { email, token } = req.params;
    if (!email || !password || !token) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    SignupRequest.findOne({ email: email, token: token }).then((requestUser) => {
        if (!requestUser) {
            console.log("email and token do not match");
            res.json({ 'success': false, 'reason': 'Invalid token' });
            return;
        }
        let timestampNow = Math.floor(Date.now() / 1000);
        if (requestUser.expiry < timestampNow) {
            console.log("expired");
            res.json({ 'success': false, 'reason': 'Token is expired' });
            return;
        }
        bcrypt.compare(password, requestUser.password).then(matching => {
            if (matching) {
                const user = new User({
                    email: requestUser.email,
                    password: requestUser.password,
                    firstName: requestUser.firstName,
                    lastName: requestUser.lastName,
                    active: true
                });
                User.findOneAndUpdate({ email: email, active: true }, { $setOnInsert: user }, { upsert: true }, (err, doc) => {
                    if (err || (doc && !doc.isNew)) {
                        console.log(err);
                        res.json({ 'success': false });
                        return;
                    }
                    SignupRequest.findOneAndUpdate({ email: email, token: token }, { used: true }).then(updatedRequest => {
                    }).catch(err => {
                        console.log(err);
                    });
                    res.json({ 'success': true });
                });
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

module.exports = { signupView, activateView, requestUser, activateAccount };