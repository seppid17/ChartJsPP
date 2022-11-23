const User = require("../models/User");
const SignupRequest = require("../models/SignupRequest");
const Mailer = require("../utils/mail");
const Validator = require("../public/scripts/validator");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const signupView = (req, res) => {
    res.render("signup", {nonce: req.scriptNonce});
}

const activateView = (req, res) => {
    res.render("activate", {nonce: req.scriptNonce});
}

/**
 * Requests for a user account.
 * Sends an email containing the signup link
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const requestUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        // validate inputs
        if (!email) {
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

        // check if the email has an active account
        {
            let user;
            if (email.endsWith('@gmail.com')) { // gmail addresses with dots are not considered different
                let emailName = email.replace(/@gmail\.com$/, '');
                let regexName = '\\.?' + Array.from(emailName).filter(c => { return c != '.'; }).join('\\.?') + '\\.?@gmail\\.com';
                let re = new RegExp(regexName);
                user = await User.findOne({ email: { $regex: re }, active: true });
            } else {
                user = await User.findOne({ email: email, active: true });
            }
            if (user) {
                res.json({ 'success': false, 'reason': "This email already exists", 'field': 'email' });
                return;
            }
        }

        // generate a token
        let token = crypto.randomBytes(16).toString('hex');
        let timestamp = Math.floor(Date.now() / 1000) + 3600;
        //Password Hashing
        let hash = await bcrypt.hash(password, 12);
        if (!hash) {
            throw 'hashing error';
        }
        const signupRequest = new SignupRequest({
            email: email,
            password: hash,
            firstName: firstName,
            lastName: lastName,
            token: token,
            expiry: timestamp,
            used: false
        });
        await signupRequest.save();

        // generate the link
        const proxyHost = req.headers["x-forwarded-host"];
        const host = proxyHost ? proxyHost : req.headers.host;
        let link = req.protocol + '://' + host + '/activate/' + email + '/' + token;

        // send email
        try {
            await Mailer.sendMail("activate", email, link);
            res.json({ 'success': true });
        } catch (error) {
            console.log(error);
            res.json({ 'success': false, 'reason': 'Email sending failed! Try again later.' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    };
};

/**
 * Activate the account
 * @param {object} req request
 * @param {object} res response
 * @returns {void}
 */
const activateAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const { email, token } = req.params;

        // validate
        if (!email || !token) {
            res.json({ 'success': false, 'reason': 'Some required fields are empty' });
            return;
        }
        if (!Validator.validate('email', email)) {
            res.json({ 'success': false, 'reason': 'Account activation failed! Invalid email format.' });
            return;
        }
        if (!Validator.validate('token', token)) {
            res.json({ 'success': false, 'reason': 'Account activation failed! Invalid token format.' });
            return;
        }
        if (!password) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'password' });
            return;
        }
        if (!Validator.validate('password', password)) {
            res.json({ 'success': false, 'reason': 'Invalid password format.', 'field': 'password' });
            return;
        }
        let requestUser = await SignupRequest.findOne({ email: email, token: token, used: false });
        if (!requestUser) {
            res.json({ 'success': false, 'reason': 'Account activation failed! Invalid token.' });
            return;
        }
        let timestampNow = Math.floor(Date.now() / 1000);
        if (requestUser.expiry < timestampNow) {
            res.json({ 'success': false, 'reason': 'Account activation failed! Token is expired.' });
            return;
        }

        // check if the password is correct
        let matching = await bcrypt.compare(password, requestUser.password);
        if (matching === true) {
            const user = new User({
                email: requestUser.email,
                password: requestUser.password,
                firstName: requestUser.firstName,
                lastName: requestUser.lastName,
                active: true
            });
            let doc = await User.findOneAndUpdate({ email: email, active: true }, { $setOnInsert: user }, { upsert: true });
            if (doc && !doc.isNew) {
                throw 'Adding new user failed';
            }
            let updatedRequest = await SignupRequest.findOneAndUpdate({ email: email, token: token }, { used: true });
            if (updatedRequest) {
                res.json({ 'success': true });
            } else {
                throw 'Error while signup token expiring';
            }
        } else {
            res.json({ 'success': false, 'reason': 'Incorrect password', 'field': 'password' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

module.exports = { signupView, activateView, requestUser, activateAccount };