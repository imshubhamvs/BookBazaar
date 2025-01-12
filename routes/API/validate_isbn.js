const express = require('express');
const router = express.Router();
const Book = require('D:/Projects/books/models/books'); 
const { model } = require('mongoose');
router.get('/', async (req, res) => {
    const isbn = req.query.isbn;
  
    if (!isbn || isbn.length !== 13 || isNaN(isbn)) {
      return res.status(400).json({ valid: false, message: 'Invalid ISBN format' });
    }

    try {
      // Check if the book exists in the database
      const book = await Book.findOne({ isbn13: isbn });
      if (book) {
        res.json({ valid: true, message: 'ISBN is valid and exists in the database', book });
      } else {
        res.json({ valid: false, message: 'ISBN not found in the database' });
      }
    } catch (error) {
      console.error('Error validating ISBN:', error);
      res.status(500).json({ valid: false, message: 'Server error' });
    }
  });
module.exports = router;