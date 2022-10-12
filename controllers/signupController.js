const User = require("../models/User");
const SignupRequest = require("../models/SignupRequest");
const Mailer = require("../utils/mail");
const Validator = require("../utils/validator");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const signupView = (req, res) => {
    res.render("signup", {});
}

const activateView = (req, res) => {
    res.render("activate", {});
}

const requestUser = (req, res) => {
    const { email, password, firstName, lastName, cnfPassword } = req.body;
    if (!email) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Email cannot be empty', 'field': 'email' });
        return;
    }
    if (!Validator.validate('email', email)) {
        res.json({ 'success': false, 'reason': 'Invalid email', 'field': 'email' });
        return;
    }
    if (!firstName) {
        res.json({ 'success': false, 'reason': 'Name cannot be empty', 'field': 'firstname' });
        return;
    }
    if (!Validator.validate('name', firstName)) {
        res.json({ 'success': false, 'reason': 'Invalid first name', 'field': 'firstname' });
        return;
    }
    if (!lastName) {
        res.json({ 'success': false, 'reason': 'Name cannot be empty', 'field': 'lastname' });
        return;
    }
    if (!Validator.validate('name', lastName)) {
        res.json({ 'success': false, 'reason': 'Invalid last name', 'field': 'lastname' });
        return;
    }
    if (!password) {
        res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'password' });
        return;
    }
    if (!Validator.validate('password', password)) {
        res.json({ 'success': false, 'reason': 'Invalid password', 'field': 'password' });
        return;
    }
    if (!cnfPassword) {
        res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'cnfPassword' });
        return;
    }
    if (password !== cnfPassword) {
        res.json({ 'success': false, 'reason': 'Password dosen\'t match', 'field': 'cnfPassword' });
        return;
    }
    User.findOne({ email: email, active: true }).then(user => {
        if (user) {
            console.log("email exists");
            res.json({ 'success': false, 'reason': "This email already exists", 'field': 'email' });
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
                            res.json({ 'success': false, 'reason': 'Email sending failed! Try again later.' });
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
    if (!email || !token) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    if (!password) {
        res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'password' });
        return;
    }
    if (!Validator.validate('email', email)) {
        res.json({ 'success': false, 'reason': 'Account activation failed! Invalid email format.' });
        return;
    }
    if (!Validator.validate('password', password)) {
        res.json({ 'success': false, 'reason': 'Invalid password format.', 'field': 'password' });
        return;
    }
    if (!Validator.validate('token', token)) {
        res.json({ 'success': false, 'reason': 'Account activation failed! Invalid token format.' });
        return;
    }
    SignupRequest.findOne({ email: email, token: token }).then((requestUser) => {
        if (!requestUser) {
            res.json({ 'success': false, 'reason': 'Account activation failed! Invalid token.' });
            return;
        }
        let timestampNow = Math.floor(Date.now() / 1000);
        if (requestUser.expiry < timestampNow) {
            console.log("expired");
            res.json({ 'success': false, 'reason': 'Account activation failed! Token is expired.' });
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
                res.json({ 'success': false, 'reason': 'Incorrect password', 'field': 'password' });
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