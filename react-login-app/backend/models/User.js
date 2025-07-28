const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, default: null },
  role: { type: String, default: "user" },
  picture: String,

 
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);
