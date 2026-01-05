import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1, size, color) => {
        const productId = product.id || product._id;

        const existingItem = cart.find(
            (item) =>
                (item.product.id || item.product._id) === productId &&
                item.size === size &&
                item.color === color
        );

        let newCart;
        if (existingItem) {
            newCart = cart.map((item) =>
                item === existingItem
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
        } else {
            newCart = [...cart, {
                product,
                quantity,
                size,
                color,
                _id: Date.now().toString()
            }];
        }
        setCart(newCart);
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        const newCart = cart.map((item) =>
            item._id === itemId ? { ...item, quantity } : item
        );
        setCart(newCart);
    };

    const removeFromCart = (itemId) => {
        const newCart = cart.filter((item) => item._id !== itemId);
        setCart(newCart);
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const cartTotal = cart.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0
    );

    const totalItems = cart.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        totalItems,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
