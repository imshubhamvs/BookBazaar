const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Manually selected categories
const SELECTED_CATEGORIES = ['Fiction', 'History', 'Philosophy', 'Biography', 'Science'];

router.get('/fixed-categories', async (req, res) => {
  try {
    const result = [];

    for (const category of SELECTED_CATEGORIES) {
      const books = await Book.find({ categories: category }).limit(6);
      if (books.length > 0) {
        result.push({ category, books });
      }
    }

    res.json(result);
  } catch (err) {
    console.error('Error fetching books by fixed categories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});


module.exports = router;
