// middlewares/authMiddleware.js

exports.isLoggedIn = (req, res, next) => {
    // console.log(req.session, req.session.user);
  if (req.session && req.session.user.id) {
    // User is authenticated
    
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }
};
