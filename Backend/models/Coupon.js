
const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountAmount: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  expiresAt: { type: Date },
  usageLimit: { type: Number, default: 1 }, // times a user can use it
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
