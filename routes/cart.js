const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Adjust to your User model
const auth = require('../middleware/auth'); // Assuming auth is in middleware directory

router.use(auth);

router.post('/updateCart', auth, async (req, res) => {
    if (!req.user) {
        console.log('User not authenticated');
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({ userId: req.user.userId });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const { isbn13,qtty} = req.body;
        if (!isbn13) {
            return res.status(400).send("Invalid cart item");
        }
        const existingItemIndex = user.cart.findIndex(cartItem => cartItem.isbn === isbn13);

        if (existingItemIndex > -1) {
            // Update the quantity of an existing item
            await User.updateOne(
                { userId: req.user.userId, "cart.isbn": isbn13 },
                { $inc: { "cart.$.quantity": qtty } }
            );
        } else {
            // Add a new item to the cart
            await User.updateOne(
                { userId: req.user.userId },
                { $push: { "cart": { "isbn":isbn13, "quantity":1 } } }
            );
        }

        res.status(200).json("Cart updated successfully");
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json("Error updating cart");
    }
});

module.exports = router;
