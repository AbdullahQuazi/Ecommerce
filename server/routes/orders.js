const express = require('express');
const router = express.Router();
const { readJSON, writeJSON, generateId } = require('../config/db');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
router.post('/', protect, (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const shippingPrice = itemsPrice > 1000 ? 0 : 100;
        const taxPrice = Math.round(itemsPrice * 0.18);
        const totalPrice = itemsPrice + shippingPrice + taxPrice;

        const orders = readJSON('orders.json');

        const newOrder = {
            id: generateId(),
            user: { id: req.user.id, name: req.user.name, email: req.user.email },
            items,
            shippingAddress,
            paymentMethod: paymentMethod || 'COD',
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
        };

        orders.push(newOrder);
        writeJSON('orders.json', orders);

        res.status(201).json({ ...newOrder, _id: newOrder.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders (User's orders)
router.get('/', protect, (req, res) => {
    try {
        const orders = readJSON('orders.json');
        const userOrders = orders
            .filter(o => o.user.id === req.user.id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(userOrders.map(o => ({ ...o, _id: o.id })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/:id
router.get('/:id', protect, (req, res) => {
    try {
        const orders = readJSON('orders.json');
        const order = orders.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json({ ...order, _id: order.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/admin/all (Admin)
router.get('/admin/all', protect, admin, (req, res) => {
    try {
        const orders = readJSON('orders.json');
        const sortedOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(sortedOrders.map(o => ({ ...o, _id: o.id })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/orders/:id/status (Admin)
router.put('/:id/status', protect, admin, (req, res) => {
    try {
        const { status } = req.body;
        const orders = readJSON('orders.json');
        const index = orders.findIndex(o => o.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }

        orders[index].status = status;
        if (status === 'delivered') {
            orders[index].deliveredAt = new Date().toISOString();
        }

        writeJSON('orders.json', orders);
        res.json({ message: 'Order status updated', status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
