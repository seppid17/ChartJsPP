const mongoose = require("mongoose");

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
  },
  used:{
    type: Boolean,
    required: true,
  }
});
const SignupRequest = mongoose.model("UserRequest", SignupRequestSchema, 'signup_requests');
module.exports = SignupRequest;