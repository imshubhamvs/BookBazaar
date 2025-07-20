const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post('/login', authController.login);
router.get('/me', authController.getMe); 
router.post('/logout',authController.logout);
module.exports = router;
