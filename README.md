# URBANFIT E-commerce Store

A full-stack e-commerce platform for clothing (hoodies, shorts, t-shirts) for men and women, built with React, Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication**: Google OAuth 2.0 + Email/Password login
- 🛒 **Shopping Cart**: Add, remove, update quantities
- 📦 **Product Catalog**: Filter by category, gender, and price
- 💳 **Checkout**: Order placement with Cash on Delivery
- 👤 **User Profile**: View orders, manage addresses
- 👨‍💼 **Admin Panel**: Dashboard, product/order/user management

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Authentication | Passport.js + JWT |
| Styling | Vanilla CSS (Dark Theme) |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google Cloud Console project (for OAuth)

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173

# Get from Google Cloud Console
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable OAuth consent screen
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

### 4. Seed Database

```bash
cd server

# Seed sample products
node seed/index.js

# Create admin user (admin@store.com / admin123)
node seed/createAdmin.js
```

### 5. Run Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

Visit `http://localhost:5173`

## Project Structure

```
Ecommerce/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Footer, ProductCard
│   │   ├── context/           # AuthContext, CartContext
│   │   ├── pages/             # Home, Shop, Cart, Admin, etc.
│   │   ├── services/          # API service
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/                # DB & Passport config
│   ├── middleware/            # Auth middleware
│   ├── models/                # User, Product, Order
│   ├── routes/                # API routes
│   ├── seed/                  # Database seeders
│   ├── server.js
│   └── package.json
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/google | Google OAuth |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| GET | /api/cart | Get user cart |
| POST | /api/cart | Add to cart |
| POST | /api/orders | Create order |
| GET | /api/admin/stats | Admin dashboard stats |

## Default Credentials

**Admin Account:**
- Email: admin@store.com
- Password: admin123

## License

MIT
