const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Cart is managed on frontend with localStorage
// These routes are for API completeness

router.get('/', protect, (req, res) => {
    res.json([]);
});

router.post('/', protect, (req, res) => {
    res.json({ message: 'Cart updated', ...req.body });
});

router.delete('/', protect, (req, res) => {
    res.json({ message: 'Cart cleared' });
});

module.exports = router;
