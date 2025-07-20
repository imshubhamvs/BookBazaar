const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn13: String,
  isbn10: String,
  title: String,
  subtitle: String,
  authors: [String],
  categories: [String],
  thumbnail: String,
  description: String,
  published_year: Number,
  average_rating: Number,
  num_pages: Number,
  ratings_count: Number,
  price: Number
});

module.exports = mongoose.model('Book', bookSchema);
