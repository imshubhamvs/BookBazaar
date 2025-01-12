const express = require('express');
const router = express.Router();
const Book = require('../models/books'); // Adjust the path if necessary
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');
// Home Page Route
router.get('/',auth, async (req, res) => {
    try {
        // Fetch books by category
        const topRatedBooks = await Book.find().sort({'average_rating':-1}).limit(10);
        const fictionBooks = await Book.find({ categories: 'Fiction' }).limit(10);
        const biographyBooks = await Book.find({ categories: 'Biography & Autobiography' }).limit(10);
        
        let cart = null;
        if(req.user)
        {
            cart = req.user.cart ;
        }
        // Render home.ejs directly
        res.render('home', {
            title: 'Home - Bookstore',
            topRatedBooks,
            fictionBooks,
            userCart:cart,
            biographyBooks
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Server Error');
    }
});
async function getBookbyIsbn(isbn) {
    const book = await Book.findOne({ isbn13: isbn });
    return book;
}
router.get('/sell_books',(req,res)=>
{
    res.status(200).render('sell_books',{title:"Sell your books"});
})
router.get('/mycart', auth, async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.user.userId });
        const cartData = user.cart;

        // Use map to create an array of promises
        const bookPromises = cartData.map(element => {
            return getBookbyIsbn(element.isbn); // Pass the correct isbn value
        });

        // Wait for all promises to resolve
        const books = await Promise.all(bookPromises);

        res.render('mycart', { title: "My-cart",userCart:req.user.cart, books });
    } catch (error) {
        console.error('Error fetching cart data:', error);
        res.status(500).send('Error fetching cart data');
    }
});

module.exports = router;
