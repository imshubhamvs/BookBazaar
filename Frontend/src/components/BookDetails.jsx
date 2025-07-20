import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './BookDetails.css';

export default function BookDetails({ cart, setCart }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5000/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error loading book:', err));
  }, [id]);

  if (!book) return <p>Loading...</p>;

  const quantity = cart?.[book?._id] || 0;


  const addToCart = () => {
    setCart({ ...cart, [book._id]: quantity + 1 });
  };

  const removeFromCart = () => {
    if (quantity > 0) {
      const updatedCart = { ...cart };
      if (quantity === 1) {
        delete updatedCart[book._id];
      } else {
        updatedCart[book._id] = quantity - 1;
      }
      setCart(updatedCart);
    }
  };
  const handleBuyNow = () => {
  navigate('/place-order', {
    state: {
      items: [
        {
          book,
          quantity: quantity || 1
        }
      ]
    }
  });
};
  const shortDesc = book.description?.split(" ").slice(0, 25).join(" ") + "...";

  return (
    <div className="book-details">
      <img src={book.thumbnail} alt={book.title} className="book-image" />
      <div className="book-info">
        <h2>{book.title}</h2>
        <p className="author">by {book.authors.join(', ')}</p>
        <p className="description">
          {showFullDesc ? book.description : shortDesc}
          {book.description?.length > 100 && (
            <button onClick={() => setShowFullDesc(!showFullDesc)} className="see-more">
              {showFullDesc ? 'See Less' : 'See More'}
            </button>
          )}
        </p>
        <p className="price">Price: ₹{book.price?.toFixed(2) || "N/A"}</p>

        <div className="action-buttons">
          {quantity > 0 ? (
            <div className="quantity-controls">
              <button onClick={removeFromCart}>−</button>
              <span>{quantity}</span>
              <button onClick={addToCart}>+</button>
            </div>
          ) : (
            <button onClick={addToCart}>Add to Cart</button>
          )}
          <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}
