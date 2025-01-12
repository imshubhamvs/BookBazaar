const express = require('express');
const router = express.Router();
const Book = require('../models/books'); // Adjust the path if necessary
const auth = require('../middleware/auth')
const Post = require('../models/post');
router.get('/',auth,async (req,res)=>{
    const category = req.query.category;
    if(!category)
    {
        
        return res.status(400).json({message:"category is required"});
    }
    try {
        const books = await Book.find({categories:{$in:[category]}}).limit(20);
        // res.status(200).json(books);
        let cart = null
        if(req.user)
        {
            cart = req.user.cart ;
        }
        
        res.render("layout",{title:"results",userCart:cart,results:books});
    } catch (error) {
        
        console.log(error)
        // res.status(500).json({message:"Error in sending data"});
    }
})
router.get('/product',async (req,res)=>{
    const id = req.query.postId;
    // console.log(typeof(id));
    // const product = Post.findOne({postId:id});
    try
    {
    const book = await Book.findOne({isbn13:id});
    // console.log(book);
    const similarBooks =await Book.find({ categories: book.categories[0] }).limit(10);
    const cart = null;
    if(req.user)
    {
        cart = req.user.cart;
    }
    res.status(200).render('products',{title:"product",product:book,similarBooks,cartItem:cart});
    }
    catch(error)
    {
        console.log(error);
    }


})
module.exports = router;
// books/product?postId=