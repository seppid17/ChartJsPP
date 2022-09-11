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

const loginUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Fill empty fields");
        res.redirect('/login');
        return;
    }
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
                    Mailer.sendMail(email, token, (error, info) => {
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

module.exports = { signupView, loginView, requestUser, loginUser }