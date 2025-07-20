import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import CategoryRow from './components/CategoryRow';
import BookDetails from './components/BookDetails';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import AccountPage from './components/AccountPage';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';

import './App.css';

export default function App() {
  const [topCategories, setTopCategories] = useState([]);
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/api/books/fixed-categories')
      .then((res) => res.json())
      .then((data) => setTopCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar cart={cart} />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {topCategories.map(({ category, books }) => (
                    <CategoryRow
                      key={category}
                      category={category}
                      books={books}
                      cart={cart}
                      setCart={setCart}
                    />
                  ))}
                </>
              }
            />
            <Route path="/book/:id" element={<BookDetails cart={cart} setCart={setCart} />} />

            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/place-order" element={<PlaceOrder cart={cart} setCart={setCart}/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
