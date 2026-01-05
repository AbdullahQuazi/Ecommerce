const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: {
        type: String,
        required: true,
        enum: ['hoodies', 't-shirts', 'shorts', 'pants', 'jackets', 'accessories']
    },
    gender: {
        type: String,
        required: true,
        enum: ['men', 'women', 'unisex']
    },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{
        name: String,
        hex: String,
    }],
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
