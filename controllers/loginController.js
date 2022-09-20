const { User, SignupRequest } = require("../models/User");
const { ResetPasswordRequest } = require("../models/ResetPassword");
const Mailer = require("../utils/mail");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const signupView = (req, res) => {
    res.render("signup", {});
}

const loginView = (req, res) => {
    res.render("login", {});
}

const activateView = (req, res) => {
    res.render("activate", {});
}

const forgotPasswordView = (req, res) => {
    res.render("forgotPassword", {});
}

const resetPasswordView = (req, res) => {
    res.render("resetPassword", {});
}

const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    // TODO : validate
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
                res.json({ 'success': true });
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
            expiry: timestamp
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
                            console.log('Email sent: ' + info.response);
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
                    console.log('success');
                    res.json({ 'success': true });
                });
            } else {
                res.json({ 'success': false });
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

const forgotPassword = (req, res) => {
    const { email } = req.body;
    if (!email) {
        console.log("Fill empty fields");
        res.json({ 'success': false });
        return;
    }
    User.findOne({ email: email, active: true }).then(user => {
        if (!user) {
            console.log("email does not exist");
            res.json({ 'success': false, 'reason': "This email does not exist" });
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
                        res.json({ 'success': false, 'reason': 'Error sending email' });
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
    if (!email || !password || !token) {
        console.log("Fill empty fields");
        res.json({ 'success': false, 'reason': 'Some required fields are empty' });
        return;
    }
    ResetPasswordRequest.findOne({ email: email, token: token, used: false }).then((resetPasswordRequest) => {
        if (!resetPasswordRequest) {
            console.log("invalid or expired token");
            res.json({ 'success': false, 'reason': 'Invalid token' });
            return;
        }
        let timestampNow = Math.floor(Date.now() / 1000);
        if (resetPasswordRequest.expiry < timestampNow) {
            console.log("expired");
            res.json({ 'success': false, 'reason': 'Token is expired' });
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

module.exports = { signupView, loginView, activateView, forgotPasswordView, resetPasswordView, requestUser, loginUser, activateAccount, forgotPassword, resetPassword };