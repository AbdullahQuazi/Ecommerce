require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
    {
        name: 'Urban Streetwear Hoodie',
        description: 'Premium cotton blend hoodie with a modern streetwear aesthetic. Features kangaroo pocket and adjustable drawstring hood.',
        price: 2499,
        originalPrice: 3499,
        category: 'hoodies',
        gender: 'men',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Navy', hex: '#1e3a5f' }],
        stock: 50,
        featured: true,
        rating: 4.5,
        numReviews: 128,
    },
    {
        name: 'Classic Comfort T-Shirt',
        description: 'Ultra-soft 100% cotton t-shirt with a relaxed fit. Perfect for everyday wear.',
        price: 999,
        originalPrice: 1299,
        category: 't-shirts',
        gender: 'men',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: [{ name: 'White', hex: '#ffffff' }, { name: 'Black', hex: '#1a1a1a' }, { name: 'Gray', hex: '#6b7280' }],
        stock: 100,
        featured: true,
        rating: 4.8,
        numReviews: 256,
    },
    {
        name: 'Athletic Performance Shorts',
        description: 'Lightweight, breathable shorts designed for maximum comfort during workouts or casual wear.',
        price: 1299,
        originalPrice: 1799,
        category: 'shorts',
        gender: 'men',
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Navy', hex: '#1e3a5f' }],
        stock: 75,
        featured: false,
        rating: 4.3,
        numReviews: 89,
    },
    {
        name: 'Oversized Vintage Hoodie',
        description: 'Trendy oversized hoodie with vintage wash effect. Features dropped shoulders and cozy fleece lining.',
        price: 2799,
        originalPrice: 3999,
        category: 'hoodies',
        gender: 'women',
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [{ name: 'Lavender', hex: '#e6e6fa' }, { name: 'Sage', hex: '#9dc183' }],
        stock: 40,
        featured: true,
        rating: 4.7,
        numReviews: 167,
    },
    {
        name: 'Cropped Graphic Tee',
        description: 'Stylish cropped t-shirt with unique graphic print. Made from premium organic cotton.',
        price: 1199,
        originalPrice: 1499,
        category: 't-shirts',
        gender: 'women',
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [{ name: 'White', hex: '#ffffff' }, { name: 'Pink', hex: '#ffc0cb' }],
        stock: 60,
        featured: true,
        rating: 4.6,
        numReviews: 134,
    },
    {
        name: 'High-Waist Biker Shorts',
        description: 'Flattering high-waist shorts with compression fabric. Perfect for workouts or casual styling.',
        price: 1499,
        originalPrice: 1999,
        category: 'shorts',
        gender: 'women',
        images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Burgundy', hex: '#800020' }],
        stock: 80,
        featured: false,
        rating: 4.4,
        numReviews: 98,
    },
    {
        name: 'Premium Denim Jacket',
        description: 'Classic denim jacket with modern fit. Features brass buttons and multiple pockets.',
        price: 3999,
        originalPrice: 5499,
        category: 'jackets',
        gender: 'unisex',
        images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Light Blue', hex: '#add8e6' }, { name: 'Dark Blue', hex: '#00008b' }],
        stock: 30,
        featured: true,
        rating: 4.9,
        numReviews: 78,
    },
    {
        name: 'Slim Fit Chino Pants',
        description: 'Versatile chino pants with stretch comfort. Smart-casual style for any occasion.',
        price: 2299,
        originalPrice: 2999,
        category: 'pants',
        gender: 'men',
        images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Khaki', hex: '#c3b091' }, { name: 'Navy', hex: '#1e3a5f' }, { name: 'Black', hex: '#1a1a1a' }],
        stock: 45,
        featured: false,
        rating: 4.2,
        numReviews: 65,
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Product.deleteMany({});
        console.log('Cleared existing products');

        await Product.insertMany(products);
        console.log('✅ Products seeded successfully!');
        console.log(`Added ${products.length} products`);

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedProducts();
