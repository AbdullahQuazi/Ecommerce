const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, generateId } = require('../config/db');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
router.get('/', (req, res) => {
    try {
        const { category, gender, minPrice, maxPrice, search, featured, sort } = req.query;

        let products = readJSON('products.json');

        if (category) products = products.filter(p => p.category === category);
        if (gender) products = products.filter(p => p.gender === gender);
        if (featured === 'true') products = products.filter(p => p.featured);
        if (minPrice) products = products.filter(p => p.price >= Number(minPrice));
        if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
        if (search) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
        if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/:id
router.get('/:id', (req, res) => {
    try {
        const products = readJSON('products.json');
        const product = products.find(p => p.id === req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ ...product, _id: product.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products (Admin)
router.post('/', protect, admin, (req, res) => {
    try {
        const products = readJSON('products.json');

        const newProduct = {
            id: generateId(),
            ...req.body,
            rating: 0,
            numReviews: 0,
        };

        products.push(newProduct);
        writeJSON('products.json', products);

        res.status(201).json({ ...newProduct, _id: newProduct.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/products/:id (Admin)
router.put('/:id', protect, admin, (req, res) => {
    try {
        const products = readJSON('products.json');
        const index = products.findIndex(p => p.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        products[index] = { ...products[index], ...req.body };
        writeJSON('products.json', products);

        res.json({ ...products[index], _id: products[index].id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/products/:id (Admin)
router.delete('/:id', protect, admin, (req, res) => {
    try {
        let products = readJSON('products.json');
        const index = products.findIndex(p => p.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        products = products.filter(p => p.id !== req.params.id);
        writeJSON('products.json', products);

        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
