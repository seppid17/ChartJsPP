const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const fs = require('fs');
const crypto = require('crypto');
const Mailer = require('./utils/mail');
const MongoStore = require('connect-mongo');

// set path environment variables
require("dotenv").config({ path: "./.env" });

// account activation email format
const activateTemplate = fs.readFileSync('utils/activateMail.html', { encoding: 'utf8', flag: 'r' });

// password reset email format
const resetPasswordTemplate = fs.readFileSync('utils/resetPasswordMail.html', { encoding: 'utf8', flag: 'r' });

// initialize mailer with email templates
Mailer.init(process.env.GMAIL_SENDER, process.env.GMAIL_PASSWORD, {
    activate: { subject: "ChartJS++ Account Activation", body: activateTemplate },
    resetPassword: { subject: "ChartJS++ Password Reset", body: resetPasswordTemplate }
});

async function startServer() {
    // connect to mongodb server
    let mongoConnected = false;
    try {
        mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Connected to MongoDB');
        mongoConnected = true;
    } catch (err) {
        console.log(err)
    }

    // express app
    const app = express();
    app.disable('x-powered-by');
    app.set('view engine', 'ejs');
    app.use(express.urlencoded({ limit: "5mb", extended: true, parameterLimit: 50 }));

    // use mongo store for session storage when possible
    let sessionStore = null;
    if (mongoConnected) {
        sessionStore = MongoStore.create({
            client: mongoose.connection.getClient(), autoRemove: 'interval',
            autoRemoveInterval: 120,
            crypto: {
                secret: process.env.MONGOSTORE_SECRET
            }
        });
        console.log('Using MongoStore');
    }
    if (sessionStore == null) {
        sessionStore = new session.MemoryStore();
    }
    app.use(session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000, // 1 hour
            sameSite: 'lax'
        },
        resave: false,
        rolling: true,
        store: sessionStore
    }));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(express.static("public"));

    // set http headers for security
    app.disable('x-powered-by');
    app.use(function (req, res, next) {
        let scriptNonce = crypto.randomBytes(16).toString('hex');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Content-Security-Policy', "script-src 'strict-dynamic' 'nonce-" + scriptNonce + "'; base-uri 'self'; connect-src 'self' *.fontawesome.com; frame-src 'none'; form-action 'none'; object-src 'none';");
        res.setHeader('X-Content-Type-Options', 'nosniff');
        req.scriptNonce = scriptNonce;
        next();
    });

    // routes for any user (login not required)
    app.use('/', require('./routes/login'));
    app.use('/', require('./routes/signup'));
    app.use('/', require('./routes/passwordReset'));
    app.use('/chart', require('./routes/chart'));
    app.use('/sampleData', require('./routes/sampleData'));
    app.use('/userManual', require('./routes/userManual'));

    // authenticate user
    app.use('/', require('./routes/auth'));

    // routes for logged users
    app.use('/dashboard', require('./routes/dashboard'));
    app.use('/chart', require('./routes/authChart'));
    app.use('/account', require('./routes/account'));

    // serve
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, console.log("Server has started at port " + PORT));
}

startServer();