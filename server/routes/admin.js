const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../config/db');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/admin/stats
router.get('/stats', protect, admin, (req, res) => {
    try {
        const users = readJSON('users.json');
        const products = readJSON('products.json');
        const orders = readJSON('orders.json');

        const totalUsers = users.filter(u => u.role === 'user').length;
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => !['cancelled', 'cancel_requested'].includes(o.status))
            .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(o => ({ ...o, _id: o.id }));

        const ordersByStatus = {
            pending: orders.filter(o => o.status === 'pending').length,
            processing: orders.filter(o => o.status === 'processing').length,
            shipped: orders.filter(o => o.status === 'shipped').length,
            delivered: orders.filter(o => o.status === 'delivered').length,
        };

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentOrders,
            ordersByStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/admin/users
router.get('/users', protect, admin, (req, res) => {
    try {
        const users = readJSON('users.json');
        const safeUsers = users.map(u => ({
            _id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt,
        }));

        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/users/:id/role
router.put('/users/:id/role', protect, admin, (req, res) => {
    try {
        const { role } = req.body;
        const users = readJSON('users.json');
        const index = users.findIndex(u => u.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users[index].role = role;
        writeJSON('users.json', users);

        res.json({ message: 'User role updated', role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, (req, res) => {
    try {
        let users = readJSON('users.json');
        const index = users.findIndex(u => u.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users = users.filter(u => u.id !== req.params.id);
        writeJSON('users.json', users);

        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
