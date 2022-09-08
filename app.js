const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config({ path: "./.env" });
const database = process.env.MONGO_URI;
mongoose.connect(database, {useUnifiedTopology: true, useNewUrlParser: true })
.then(() => console.log('connected to MongoDB'))
.catch(err => console.log(err));
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));
app.use('/', require('./routes/login'));
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log("Server has started at port " + PORT))