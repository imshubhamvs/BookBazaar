import React, { useEffect, useState } from 'react';
import './PlaceOrder.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';


// Then:

// import User from '../../../Backend/models/User';

export default function PlaceOrder({ cart, setCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const { user } = useAuth();

  const [useDifferentAddress, setUseDifferentAddress] = useState(false); // NEW
  const [newAddress, setNewAddress] = useState(''); // NEW

  const shippingFee = 40;
  const gstRate = 0.05;

  useEffect(() => {
    const stateItems = location?.state?.items || [];
    setItems(stateItems);
  }, [location]);

  const increaseQty = (bookId) => {
    setCart((prev) => {
      const newQty = (prev[bookId] || 0) + 1;
      const updated = items.map((item) =>
        item.book._id === bookId ? { ...item, quantity: newQty } : item
      );
      setItems(updated);
      return { ...prev, [bookId]: newQty };
    });
  };

  const decreaseQty = (bookId) => {
    setCart((prev) => {
      const currentQty = prev[bookId] || 0;
      if (currentQty <= 1) {
        const updated = items.filter((item) => item.book._id !== bookId);
        setItems(updated);
        const newCart = { ...prev };
        delete newCart[bookId];
        return newCart;
      }
      const updated = items.map((item) =>
        item.book._id === bookId ? { ...item, quantity: currentQty - 1 } : item
      );
      setItems(updated);
      return { ...prev, [bookId]: currentQty - 1 };
    });
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      const price = item.book?.price || 0;
      const qty = item.quantity || 0;
      return acc + price * qty;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const gst = subtotal * gstRate;
  const total = subtotal + gst + shippingFee - discount;

  const handleApplyCoupon = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders/bx1/cp',
        {
          couponCode,
          subtotal,
        },
        { withCredentials: true }
      );
      setDiscount(res.data.discount || 0);
      setCouponApplied(true);
      alert('Coupon applied!');
    } catch (err) {
      setDiscount(0);
      setCouponApplied(false);
      alert(err.response?.data?.message || 'Invalid coupon code');
    }
  };

  const placeOrder = async () => {
    try {
      console.log(user.address);
      const res = await axios.post(
        'http://localhost:5000/api/orders/place-order',
        {
          items: items.map((item) => ({
            productId: item.book._id,
            quantity: item.quantity,
          })),
          couponCode: couponApplied ? couponCode : '',
         address: useDifferentAddress ? newAddress : user?.address // NEW
        },
        { withCredentials: true }
      );

      alert('Order placed successfully!');
      setCart({});
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Please log in to place an order.');
        navigate('/login');
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || 'Please complete your address before ordering.');
        navigate('/account');
      } else {
        alert('Something went wrong while placing your order.');
      }
    }
  };

  return (
    <div className="place-order-container">
      <h2>Order Summary</h2>

      <div className="order-items-list">
        {items.map(({ book, quantity }) => (
          <div className="order-book-card" key={book._id}>
            <img src={book.thumbnail} alt={book.title} />
            <div className="book-info">
              <h3>{book.title}</h3>
              <p>{book.authors.join(', ')}</p>
              <p>Price: ₹{book.price}</p>
              <div className="quantity-controls">
                <button onClick={() => decreaseQty(book._id)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => increaseQty(book._id)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="coupon-section">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={couponApplied}
        />
        <button onClick={handleApplyCoupon} disabled={couponApplied}>
          {couponApplied ? 'Applied' : 'Apply'}
        </button>
      </div>

      <div className="address-section"> {/* NEW */}
        <label>
          <input
            type="checkbox"
            checked={useDifferentAddress}
            onChange={() => setUseDifferentAddress(!useDifferentAddress)}
          />
          Ship to a different address?
        </label>
        {useDifferentAddress && (
          <textarea
            rows="3"
            placeholder="Enter delivery address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            required
          />
        )}
      </div>

      <div className="price-breakdown">
        <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
        <p>GST (5%): ₹{gst.toFixed(2)}</p>
        <p>Shipping Fee: ₹{shippingFee}</p>
        {discount > 0 && (
          <p className="discount">Discount: -₹{discount.toFixed(2)}</p>
        )}
        <h3>Total: ₹{total.toFixed(2)}</h3>
      </div>

      <button className="place-order-btn" onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}
