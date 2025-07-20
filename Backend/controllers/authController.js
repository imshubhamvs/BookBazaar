const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendOtpEmail = require("../utils/sendOtp");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// ------------------------
// Register User
// ------------------------
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, address } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 minutes

    const user = new User({
      userId: uuidv4(), // Ensure uniqueness
      fullName,
      email,
      phone,
      password: hashedPassword,
      address,
      otp,
      otpExpiry,
    });

    await user.save();
    await sendOtpEmail(email, otp);

    res.status(201).json({ message: "OTP sent to email for verification" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// ------------------------
// Verify OTP
// ------------------------
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Standardized session structure
    req.session.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
    };

    res.cookie("user", user._id, { httpOnly: true });
    res.status(200).json({ message: "User verified and session started" });
  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

// ------------------------
// Login
// ------------------------
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    req.session.user = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      address:user.address
    };

    const safeUser = await User.findById(user._id).select("-password -otp -otpExpiry");
    res.json({ message: "Login successful", user: safeUser });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// ------------------------
// Get Current User (Session)
// ------------------------
exports.getMe = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const { id, email, fullName, address } = req.session.user;

    res.json({
      user: {
        _id: id,
        email,
        fullName,
        address,
      },
    });
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};


// ------------------------
// Logout
// ------------------------
exports.logout = (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Logout Error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }

      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: "Error during logout" });
  }
};
