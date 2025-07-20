// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  priceSummary: {
    subtotal: Number,
    discount: Number,
    tax: Number,
    total: Number
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  shippingAddress: {
    house: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  placedAt: {
    type: Date,
    default: Date.now
  },
  expectedDelivery: {
    type: Date
  },
  status: {
    type: String,
    enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  }
});

module.exports = mongoose.model('Order', orderSchema);
