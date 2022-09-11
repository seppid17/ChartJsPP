const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  }
});

const SignupRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Number,
    required: true,
  }
});
const User = mongoose.model("User", UserSchema, 'users');
const SignupRequest = mongoose.model("UserRequest", SignupRequestSchema, 'signup_request');
module.exports = { User, SignupRequest };