const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/books');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
// app.use(cors());
app.use(cors({
  origin: "http://localhost:3000",  // ✅ frontend origin
  credentials: true                 // ✅ allows cookies/sessions to be sent
}));
app.use(express.json()); // ✅ must be set in app.js

app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // use true in production with https
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));


app.use('/api/books', bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart",cartRoutes);
app.use('/api', userRoutes);
app.use('/api/orders', orderRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => {
  console.error('Connection failed:', err);
});
