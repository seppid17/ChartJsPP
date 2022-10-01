const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const fs = require('fs');
require("dotenv").config({ path: "./.env" });
const Mailer = require('./utils/mail');
const activateTemplate = fs.readFileSync('utils/activateMail.html', { encoding: 'utf8', flag: 'r' });
const resetPasswordTemplate = fs.readFileSync('utils/resetPasswordMail.html', { encoding: 'utf8', flag: 'r' });
Mailer.init(process.env.GMAIL_SENDER, process.env.GMAIL_PASSWORD, {
    activate: { subject: "ChartJS++ Account Activation", body: activateTemplate },
    resetPassword: { subject: "ChartJS++ Password Reset", body: resetPasswordTemplate }
});
const database = process.env.MONGO_URI;
mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.log(err));
const app = express();
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
    resave: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/signup'));
app.use('/', require('./routes/passwordReset'));
app.use('/chart', require('./routes/chart'));
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/account', require('./routes/account'));
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log("Server has started at port " + PORT))