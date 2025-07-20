const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isLoggedIn } = require('../middlewares/authMiddleware');

router.post('/place-order', isLoggedIn, orderController.placeOrder);
router.post('/bx1/cp', isLoggedIn, orderController.applyCoupon);

module.exports = router;
