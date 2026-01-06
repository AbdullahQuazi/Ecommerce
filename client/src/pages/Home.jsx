import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiTruck, FiRefreshCw, FiUser } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const { data } = await productsAPI.getAll({ featured: 'true' });
            setFeaturedProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        {
            name: 'Hoodies',
            image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
            count: '50+ Products',
            link: '/shop?category=hoodies',
        },
        {
            name: 'T-Shirts',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
            count: '80+ Products',
            link: '/shop?category=t-shirts',
        },
        {
            name: 'Shorts',
            image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600',
            count: '40+ Products',
            link: '/shop?category=shorts',
        },
    ];

    return (
        <main>
            {/* Welcome Header for logged-in users */}
            {user && (
                <section className="welcome-header">
                    <div className="container">
                        <div className="welcome-content">
                            <FiUser size={20} />
                            <span>Welcome back, <strong>{user.name}</strong>!</span>
                            <Link to="/collection" className="welcome-link">
                                View Your Collection <FiArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <FiZap size={16} />
                            New Collection 2026
                        </div>
                        <h1 className="hero-title">
                            Redefine Your <span>Streetwear</span> Style
                        </h1>
                        <p className="hero-description">
                            Discover premium quality hoodies, t-shirts, and more.
                            Designed for comfort, built for style. Express yourself
                            with our unique urban fashion collection.
                        </p>
                        <div className="hero-actions">
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                Shop Now <FiArrowRight />
                            </Link>
                            <Link to="/shop?featured=true" className="btn btn-secondary btn-lg">
                                View Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section style={{ padding: 'var(--spacing-2xl) 0', background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FiTruck size={24} />
                            </div>
                            <div>
                                <h4>Free Shipping</h4>
                                <p>On orders above ₹1000</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FiRefreshCw size={24} />
                            </div>
                            <div>
                                <h4>Easy Returns</h4>
                                <p>30-day return policy</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FiZap size={24} />
                            </div>
                            <div>
                                <h4>Premium Quality</h4>
                                <p>100% quality guaranteed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Shop by Category</h2>
                        <Link to="/shop" className="btn btn-outline">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link to={category.link} key={category.name} className="category-card">
                                <img src={category.image} alt={category.name} />
                                <div className="category-content">
                                    <h3 className="category-title">{category.name}</h3>
                                    <p className="category-count">{category.count}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="products-section" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <Link to="/shop?featured=true" className="btn btn-outline">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Banner */}
            <section style={{ padding: 'var(--spacing-3xl) 0' }}>
                <div className="container">
                    <div style={{
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--spacing-3xl)',
                        textAlign: 'center',
                    }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>
                            Get 20% Off Your First Order
                        </h2>
                        <p style={{
                            maxWidth: 500,
                            margin: '0 auto var(--spacing-xl)',
                            opacity: 0.9
                        }}>
                            Join our newsletter and get exclusive access to new arrivals,
                            special offers, and style tips.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-md)',
                            justifyContent: 'center',
                            maxWidth: 500,
                            margin: '0 auto'
                        }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                                style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}
                            />
                            <button className="btn btn-secondary btn-lg">Subscribe</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
