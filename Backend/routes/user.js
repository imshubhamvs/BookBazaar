const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed

// @route   GET /api/me
// @desc    Get current logged-in user from session
// @access  Public (requires session cookie)
router.get('/me', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const user = await User.findById(userId).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
