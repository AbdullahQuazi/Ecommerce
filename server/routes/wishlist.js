const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../config/db');
const { protect } = require('../middleware/auth');

// Helper to get collections data
const getCollections = () => {
    try {
        return readJSON('collections.json');
    } catch (error) {
        return {};
    }
};

// @route   GET /api/wishlist
// @desc    Get user's wishlist with product details
// @access  Private
router.get('/', protect, (req, res) => {
    try {
        const collections = getCollections();
        const userWishlist = collections[req.user.id] || [];

        // Get product details for each wishlist item
        const products = readJSON('products.json');
        const wishlistProducts = products.filter(p =>
            userWishlist.includes(p.id)
        ).map(p => ({ ...p, _id: p.id }));

        res.json(wishlistProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/wishlist/ids
// @desc    Get just the product IDs in user's wishlist
// @access  Private
router.get('/ids', protect, (req, res) => {
    try {
        const collections = getCollections();
        const userWishlist = collections[req.user.id] || [];
        res.json(userWishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/', protect, (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Verify product exists
        const products = readJSON('products.json');
        const product = products.find(p => p.id === productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const collections = getCollections();

        // Initialize user's wishlist if it doesn't exist
        if (!collections[req.user.id]) {
            collections[req.user.id] = [];
        }

        // Check if already in wishlist
        if (collections[req.user.id].includes(productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        // Add to wishlist
        collections[req.user.id].push(productId);
        writeJSON('collections.json', collections);

        res.status(201).json({
            message: 'Added to wishlist',
            wishlist: collections[req.user.id]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', protect, (req, res) => {
    try {
        const { productId } = req.params;
        const collections = getCollections();

        if (!collections[req.user.id]) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const index = collections[req.user.id].indexOf(productId);

        if (index === -1) {
            return res.status(404).json({ message: 'Product not in wishlist' });
        }

        // Remove from wishlist
        collections[req.user.id].splice(index, 1);
        writeJSON('collections.json', collections);

        res.json({
            message: 'Removed from wishlist',
            wishlist: collections[req.user.id]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
