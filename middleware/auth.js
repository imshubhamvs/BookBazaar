
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');

const auth = async (req, res, next) => {
  const token = req.cookies.auth_token;
  
  if (!token) {
    next();
    return ;
  }

  try {
    const decoded = jwt.verify(token, "12345678");
    // console.log('Decoded token:', decoded); // Check the decoded token
    
    const user = await User.findOne({ userId: decoded.id });
    // console.log('Found user:', user); // Log the found user object
    
    if (!user) {
      // console.log('User not found');
      
      next();
      return ;
    }

    if (user.token !== token) {
      // console.log("Token mismatch");
      
      next();
      return ;
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log('Error in auth middleware:', error);
    return res.redirect('/auth/login');
  }
};

module.exports = auth;
