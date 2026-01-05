require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminExists = await User.findOne({ email: 'admin@store.com' });
        if (adminExists) {
            console.log('Admin already exists!');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            name: 'Admin',
            email: 'admin@store.com',
            password: hashedPassword,
            role: 'admin',
        });

        console.log('✅ Admin created successfully!');
        console.log('Email: admin@store.com');
        console.log('Password: admin123');

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
