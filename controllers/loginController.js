const User = require("../models/User");
const bcrypt = require("bcrypt");

const signupView = (req, res) => {
    res.render("signup", {});
}

const loginView = (req, res) => {
    res.render("login", {});
}

const addUser = (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        console.log("Fill empty fields");
        res.json({ 'success': false });
        return;
    }
    //Confirm Passwords
    User.findOne({ email: email }).then((user) => {
        if (user) {
            console.log("email exists");
            res.json({ 'success': false, 'reason': "This email already exists"});
            return;
        }
        //Validation
        const newUser = new User({
            email,
            password,
            firstName,
            lastName
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

module.exports = { signupView, loginView, addUser }