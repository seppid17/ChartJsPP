const User = require("../models/User");
const bcrypt = require("bcrypt");

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

const addUser = (req, res) => {
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
        const newUser = new User({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            active: true
        });
        //Password Hashing
        bcrypt.hash(newUser.password, 12, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
                .then(res.json({ 'success': true }))
                .catch((err) => {
                    console.log(err);
                    res.json({ 'success': true });
                });
        });
    });
};

module.exports = { signupView, loginView, addUser, loginUser }