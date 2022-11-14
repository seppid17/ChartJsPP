const User = require("../models/User");
const { ChartInfo, ChartData } = require("../models/Chart");
const Validator = require("../utils/validator");
const bcrypt = require("bcrypt");

const accountView = (req, res) => {
    let user = req.session.user;
    res.render("account", { email: user.email, firstName: user.firstName, lastName: user.lastName, nonce: req.scriptNonce });
}

const changeName = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;
        if (!firstName) {
            res.json({ 'success': false, 'reason': 'Name cannot be empty', 'field': 'firstname' });
            return;
        }
        if (!Validator.validate('name', firstName)) {
            res.json({ 'success': false, 'reason': 'Invalid name format', 'field': 'firstname' });
            return;
        }
        if (!lastName) {
            res.json({ 'success': false, 'reason': 'Name cannot be empty', 'field': 'lastname' });
            return;
        }
        if (!Validator.validate('name', lastName)) {
            res.json({ 'success': false, 'reason': 'Invalid name format', 'field': 'lastname' });
            return;
        }
        if (!password) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'password' });
            return;
        }
        if (!Validator.validate('password', password)) {
            res.json({ 'success': false, 'reason': 'Invalid password format', 'field': 'password' });
            return;
        }

        let user = req.session.user;
        let matching = await bcrypt.compare(password, user.password);
        if (matching === true) {
            user.firstName = firstName;
            user.lastName = lastName;
            let oldUser = await User.findOneAndUpdate({ email: user.email, active: true }, { firstName: firstName, lastName: lastName });
            if (oldUser) res.json({ 'success': true });
            else res.json({ 'success': false });
        } else {
            res.json({ 'success': false, reason: 'Incorrect password', 'field': 'password' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

const changePasswd = async (req, res) => {
    try {
        const { curPassword, newPassword } = req.body;
        if (!curPassword) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'curPassword' });
            return;
        }
        if (!Validator.validate('password', curPassword)) {
            res.json({ 'success': false, 'reason': 'Invalid password format', 'field': 'curPassword' });
            return;
        }
        if (!newPassword) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'newPassword' });
            return;
        }
        if (!Validator.validate('password', newPassword)) {
            res.json({ 'success': false, 'reason': 'Invalid password format', 'field': 'newPassword' });
            return;
        }
        let user = req.session.user;
        let matching = await bcrypt.compare(curPassword, user.password);
        if (matching === true) {
            let hash = await bcrypt.hash(newPassword, 12);
            if (!hash) {
                throw 'hashing error';
            }
            user.password = hash;
            let newUser = await User.findOneAndUpdate({ email: user.email, active: true }, { password: hash });
            if (!newUser) {
                throw 'Error updating user';
            }
            res.json({ 'success': true });
        } else {
            res.json({ 'success': false, reason: 'Incorrect password', 'field': 'curPassword' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            res.json({ 'success': false, 'reason': 'Password cannot be empty', 'field': 'delPassword' });
            return;
        }
        if (!Validator.validate('password', password)) {
            res.json({ 'success': false, 'reason': 'Invalid password format', 'field': 'delPassword' });
            return;
        }
        let user = req.session.user;
        let matching = await bcrypt.compare(password, user.password);
        if (matching === true) {
            let users = await User.updateMany({ email: user.email, active: true }, { active: false });
            req.session.loggedIn = false;
            req.session.user = null;
            let charts = await ChartInfo.find({ owner: user.email }, 'id');
            charts.forEach(chart => {
                let id = chart.id;
                ChartData.deleteOne({ id: id }).catch(err => { console.log(err); });
                ChartInfo.deleteOne({ id: id }).catch(err => { console.log(err); });
            });
            res.json({ 'success': true });
        } else {
            res.json({ 'success': false, reason: 'Incorrect password', 'field': 'delPassword' });
        }
    } catch (err) {
        console.log(err);
        res.json({ 'success': false });
    }
};

module.exports = { accountView, changeName, changePasswd, deleteAccount };
