// pages/Cart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './cart.css'; // create this CSS file
import { useNavigate } from 'react-router-dom';

export default function Cart({ cart, setCart }) {
  const [cartBooks, setCartBooks] = useState([]);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cart', {
          withCredentials: true,
        });

        setCartBooks(res.data.cart);
        const newCart = res.data.cart.reduce((acc, item) => {
          acc[item.productId._id] = item.quantity;
          return acc;
        }, {});
        setCart(newCart);
      } catch (err) {
        console.error('Error fetching cart:', err.response?.data || err.message);
      }
    };

    fetchCart();
  }, [setCart]);
  const handlePlaceOrder = () => {
    console.log(cartBooks)
  const items = cartBooks.map(item => ({
    
    book: item.productId,
    quantity: item.quantity
  }));
//   console.log(items);
  navigate('/place-order', {
    
    state: { items }
  });
};

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartBooks.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          {cartBooks.map((item) => (
            <ProductCard
              key={item.productId._id}
              book={item.productId}
              cart={cart}
              setCart={setCart}
            />
          ))}
        </div>
      )}'<button className="place-order-btn" onClick={handlePlaceOrder}>
  Proceed to Checkout
</button>
'
    </div>
  );
}
