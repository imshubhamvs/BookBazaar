const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth=async (req,res,next)=>
{
    const token = req.cookies.auth_token;
    if(!token)
    {
        return res.redirect('/auth/login');
    }
    try
    {
        const decoded = jwt.verify(token,"12345678");
        const user = await User.findOne({userId:decoded.id});
        if(!user || user.token !== token)
        {
            console.log("error in token");
            return res.redirect('/auth/login');
        }
        req.user = user;
        next();
    }
    catch(error)
    {
        console.log("error in routes/profiles/auth\n",error);
    }
}
router.get('/',auth, (req, res) => {
    res.render('profile', {title:"profile", user: req.user });
    
});
module.exports=router;