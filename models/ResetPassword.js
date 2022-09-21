const mongoose = require("mongoose");
const ResetPasswordSchema = new mongoose.Schema({
  email: {
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

const ResetPasswordRequest = mongoose.model("ResetPassword", ResetPasswordSchema, 'reset_password_requests');
module.exports = ResetPasswordRequest;