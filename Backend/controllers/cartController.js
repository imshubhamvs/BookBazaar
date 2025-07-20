// controllers/cartController.js
const Cart = require('../models/Cart');
const Book = require('../models/Book');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    // console.log(req.session);
    // console.log(req.body);
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) return res.json({ cart: [] });

    res.json({ cart: cart.items });
  } catch (err) {
    console.error('Error getting cart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    // const userId = req.session.userId;
    
    //   console.log(req.session);
    // console.log(req.body);
    const { bookId } = req.body;
   
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId: bookId, quantity: 1 }] });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === bookId
      );

      if (itemIndex !== -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId: bookId, quantity: 1 });
      }
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({ cart: cart.items });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/cart/remove
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    const { bookId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    let cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ cart: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === bookId
    );

    if (itemIndex !== -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1); // remove item
      }
    }

    await cart.save();
    await cart.populate('items.productId');

    res.json({ cart: cart.items });
  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
