import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistIds, setWishlistIds] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (user) {
            fetchWishlistIds();
        } else {
            setWishlistIds([]);
            setWishlistItems([]);
        }
    }, [user]);

    const fetchWishlistIds = async () => {
        try {
            const { data } = await wishlistAPI.getIds();
            setWishlistIds(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const fetchWishlistItems = async () => {
        setLoading(true);
        try {
            const { data } = await wishlistAPI.get();
            setWishlistItems(data);
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (productId) => {
        if (!user) {
            return { success: false, message: 'Please login to add items to wishlist' };
        }

        try {
            await wishlistAPI.add(productId);
            setWishlistIds(prev => [...prev, productId]);
            return { success: true };
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to add' };
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await wishlistAPI.remove(productId);
            setWishlistIds(prev => prev.filter(id => id !== productId));
            setWishlistItems(prev => prev.filter(item => (item.id || item._id) !== productId));
            return { success: true };
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to remove' };
        }
    };

    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            return removeFromWishlist(productId);
        } else {
            return addToWishlist(productId);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistIds.includes(productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistIds,
                wishlistItems,
                loading,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                fetchWishlistItems,
                wishlistCount: wishlistIds.length,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
