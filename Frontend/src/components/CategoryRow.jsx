import React from 'react';
import ProductCard from './ProductCard';
import './CategoryRow.css';

export default function CategoryRow({ category, books, cart, setCart }) {
  return (
    <div className="category-row">
      <h2 className="category-title">{category}</h2>
      <div className="products-container">
        {books.map(book => (
          <ProductCard
            key={book._id}
            book={book}
            cart={cart}
            setCart={setCart}
          />
        ))}
      </div>
    </div>
  );
}
