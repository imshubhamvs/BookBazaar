import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CategoryRow from './components/CategoryRow';
import './App.css';

const groupByCategory = (books) => {
  return books.reduce((acc, book) => {
    if (!book.categories || book.categories.length === 0) return acc;
    book.categories.forEach(cat => {
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(book);
    });
    return acc;
  }, {});
};

export default function App() {
  const [cart, setCart] = useState({});
  const [books, setBooks] = useState([]);

useEffect(() => {
  fetch('http://localhost:5000/api/books/fixed-categories')
    .then((res) => res.json())
    .then((data) => setTopCategories(data))
    .catch((err) => console.error('Failed to fetch categories:', err));
}, []);


  const categories = groupByCategory(books);

  return (
    <div className="app">
      <Navbar cart={cart} />
      <main className="main-content">
        {Object.keys(categories).map(cat => (
          <CategoryRow
            key={cat}
            category={cat}
            books={categories[cat]}
            cart={cart}
            setCart={setCart}
          />
        ))}
      </main>
    </div>
  );
}