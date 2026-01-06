import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import PageHeader from '../components/PageHeader';
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
            <>
                <PageHeader
                    title="My Collection"
                    breadcrumbs={[{ label: 'Collection' }]}
                />
                <div className="page" style={{ paddingTop: 0 }}>
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
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="My Collection"
                subtitle={`${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'} saved`}
                breadcrumbs={[{ label: 'Collection' }]}
            />
            <div className="page" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-xl)' }}>
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
        </>
    );
};

export default Collection;
