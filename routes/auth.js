const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // Assuming User model is defined
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
// GET Login Page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', error: null }); // Pass null or empty string for error
});


// GET Register Page
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', error: "none", success: "none" }); // Pass empty values for both
});

// POST Register Route
router.post('/register', async (req, res) => {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('register', { title: 'Register', error: 'Passwords do not match',success:"none" });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.render('register', { title: 'Register', error: 'User already exists',success:"none" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = uuidv4();

        // Create new user
        user = new User({
            userId,
            name,
            email,
            phone,  // Include phone number in the user creation
            password: hashedPassword
        });

        await user.save();
        return res.render('register', { title: 'Register',error:"none", success: 'Account created successfully!' });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'User does not exist' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', {error: 'Invalid email or password' });
        }

        // Successful login
        const token = jwt.sign({id:user.userId},"12345678",{expiresIn:"1h"});
        // console.log(token);
        user.token = token;
        user.save();
        // console.log(user.cart);
        const cartEntries = user.cart || [];
        res.cookie('auth_token',token,{httpOnly:true, maxAge:60*60*1000});
        res.cookie('cart', JSON.stringify(cartEntries), { httpOnly: true, maxAge: 60 * 60 * 1000 }); // 1-hour expiry for cart data
        res.status(200).redirect('/profile'); 
    } catch (error) {
        console.error(error); 
        res.status(500).send('Server Error');
    }
}); 

module.exports = router;