import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductCard({ book, cart, setCart }) {
  const quantity = cart[book._id] || 0;

  const addToCart = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', { bookId: book._id }, { withCredentials: true });
      const updatedCart = res.data.cart.reduce((acc, item) => {
        acc[item.productId._id] = item.quantity;
        return acc;
      }, {});
      setCart(updatedCart);
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message);
    }
  };

  const removeFromCart = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/remove', { bookId: book._id }, { withCredentials: true });
      const updatedCart = res.data.cart.reduce((acc, item) => {
        acc[item.productId._id] = item.quantity;
        return acc;
      }, {});
      setCart(updatedCart);
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data || err.message);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/book/${book._id}`} className="product-card-link">
        <img src={book.thumbnail} alt={book.title} className="product-image" />
      </Link>
      <h3 className="product-title">{book.title}</h3>
      <p className="product-author">by {book.authors.join(', ')}</p>
      <p className="price">₹{book.price?.toFixed(2) || "N/A"}</p>
      {quantity === 0 ? (
        <button onClick={addToCart} className="add-to-cart">Add to Cart</button>
      ) : (
        <div className="quantity-controls">
          <button onClick={removeFromCart}>-</button>
          <span>{quantity}</span>
          <button onClick={addToCart}>+</button>
        </div>
      )}
    </div>
  );
}

// import React from 'react';
// import './ProductCard.css';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { useCart } from '../contexts/CartContext';

// export default function ProductCard({ book }) {
//   const { user } = useAuth();
//   const { cartItems, addToCart, removeFromCart } = useCart();

//   const item = cartItems.find((entry) => entry.productId._id === book._id);
//   const quantity = item ? item.quantity : 0;

//   const handleAdd = () => {
//     if (!user) return alert('Please log in to add items');
//     addToCart(book._id);
//   };

//   const handleRemove = () => {
//     if (!user) return alert('Please log in to remove items');
//     removeFromCart(book._id);
//   };

//   return (
//     <div className="product-card">
//       <Link to={`/book/${book._id}`} className="product-card-link">
//         <img src={book.thumbnail} alt={book.title} className="product-image" />
//       </Link>

//       <h3 className="product-title">{book.title}</h3>
//       <p className="product-author">by {book.authors?.join(', ')}</p>
//       <p className="price">₹{book.price?.toFixed(2) || 'N/A'}</p>

//       {quantity === 0 ? (
//         <button onClick={handleAdd} className="add-to-cart">Add to Cart</button>
//       ) : (
//         <div className="quantity-controls">
//           <button onClick={handleRemove}>-</button>
//           <span>{quantity}</span>
//           <button onClick={handleAdd}>+</button>
//         </div>
//       )}
//     </div>
//   );
// }
