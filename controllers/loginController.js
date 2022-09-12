const { User, SignupRequest } = require("../models/User");
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

const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Fill empty fields");
        res.redirect('/login');
        return;
    }
    // TODO : validate
    User.findOne({ email: email, active: true }).then((user) => {
        if (!user) {
            console.log("email does not exist");
            res.redirect('/login');
            return;
        }
        bcrypt.compare(password, user.password).then(matching => {
            if (matching) {
                req.session.loggedIn = true;
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.redirect('/login');
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    });
};

const requestUser = (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        console.log("Fill empty fields");
        res.json({ 'success': false });
        return;
    }
    User.findOne({ email: email, active: true }).then((user) => {
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
                    Mailer.sendMail(email, link, (error, info) => {
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
    });
};

const activateAccount = (req, res) => {
    const { password } = req.body;
    const { email, token } = req.params;
    if (!email || !password || !token) {
        console.log("Fill empty fields");
        res.redirect(req.path);
        return;
    }
    SignupRequest.findOne({ email: email, token: token }).then((requestUser) => {
        if (!requestUser) {
            console.log("email and token do not match");
            res.redirect(req.path);
            return;
        }
        let timestampNow = Math.floor(Date.now() / 1000);
        if (requestUser.expiry < timestampNow) {
            console.log("expired");
            res.redirect('/signup');
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
                User.findOneAndUpdate({ email: email }, user, { upsert: true }, (err, doc) => {
                    if (err) {
                        console.log(err);
                        res.redirect(req.path);
                        return;
                    }
                    console.log('success');
                    res.redirect('/dashboard');
                })
            } else {
                res.redirect(req.path);
            }
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        });
    });
};

module.exports = { signupView, loginView, activateView, requestUser, loginUser, activateAccount };