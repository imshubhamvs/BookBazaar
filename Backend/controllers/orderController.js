// controllers/orderController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Book = require('../models/Book');
const Coupon = require('../models/Coupon');

exports.placeOrder = async (req, res) => {
  try {
    console.log(req.session);
    console.log(req.body);
    const userId = req.session.user.id;
    const { items, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const address = req.body.address;

    // 1. Fetch user and address
    // const user = await User.findById(userId);
    if (!address) {
      return res.status(400).json({ message: 'No address found. Please add address before placing order.' });
    }

    // 2. Calculate subtotal
    let subtotal = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Book.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      subtotal += product.price * item.quantity;
      orderItems.push({ product: product._id, quantity: item.quantity });
    }

    // 3. Apply coupon (if any)
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode });
      if (coupon && coupon.expiresAt > new Date()) {
        discount = (coupon.discountPercent / 100) * subtotal;
        appliedCoupon = coupon._id;
      }
    }

    // 4. Add tax and final total
    const tax = 0.05 * subtotal; // e.g. 5% GST
    const total = subtotal + tax - discount;

    // 5. Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      priceSummary: {
        subtotal,
        discount,
        tax,
        total
      },
      coupon: appliedCoupon,
      shippingAddress: {
        house: address.house,
        area : address.area,
        pincode: address.pincode,

      },
      expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // +5 days
    });

    await order.save();

    return res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place order' });
  }
};
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode, subtotal } = req.body;

    if (!couponCode || !subtotal) {
      return res.status(400).json({ message: 'Coupon code and subtotal are required' });
    }

    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    const discount = (coupon.discountPercent / 100) * subtotal;

    return res.status(200).json({
      valid: true,
      discount,
      discountPercent: coupon.discountPercent,
      couponId: coupon._id,
      message: 'Coupon applied successfully'
    });

  } catch (err) {
    console.error('Error applying coupon:', err);
    res.status(500).json({ message: 'Server error applying coupon' });
  }
};