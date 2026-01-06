import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const Collection = () => {
    const { wishlistItems, loading, fetchWishlistItems, wishlistCount } = useWishlist();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchWishlistItems();
        }
    }, [user]);

    if (!user) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FiHeart />
                        </div>
                        <h3 className="empty-title">Login Required</h3>
                        <p className="empty-description">
                            Please login to view your collection.
                        </p>
                        <Link to="/login" className="btn btn-primary">
                            Login <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="section-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div>
                        <h1 className="section-title">My Collection</h1>
                        <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-sm)' }}>
                            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    <Link to="/shop" className="btn btn-outline">
                        Continue Shopping <FiArrowRight />
                    </Link>
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : wishlistItems.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FiHeart />
                        </div>
                        <h3 className="empty-title">Your collection is empty</h3>
                        <p className="empty-description">
                            Start adding products you love by clicking the heart icon!
                        </p>
                        <Link to="/shop" className="btn btn-primary">
                            Explore Products <FiArrowRight />
                        </Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {wishlistItems.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;
