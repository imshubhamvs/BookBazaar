const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  house: String,
  area: String,
  pincode: String,
});

const userSchema = new mongoose.Schema({
  userId: {
  type: String,
  unique: true,
  required: true,
},
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  
  phone: { type: String, required: true },
  address: { type: addressSchema },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date
});

module.exports = mongoose.model("User", userSchema);
