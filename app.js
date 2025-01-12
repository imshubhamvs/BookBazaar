const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json());
// View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const indexRoutes = require('./routes/index');
app.use(cookieParser());
app.use('/', indexRoutes); // Use index routes for home page and other routes
const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes); // Use book routes for book operations

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const profileRoute = require('./routes/profiles');
app.use('/profile', profileRoute);

const cartRoutes = require('./routes/cart');
app.use('/api', cartRoutes); // Cart API route

const valid_isbn_apiRout = require('./routes/API/validate_isbn');
app.use('/validateISBN',valid_isbn_apiRout);
// Error Handling Middleware
app.use((req, res, next) => {
  console.log(`404 Error - Path: ${req.path}`);
  res.status(404).render('404', { title: '404 - Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: '500 - Server Error' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookstore', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
