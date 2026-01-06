import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiHeart, FiStar, FiArrowLeft } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await productsAPI.getById(id);
            setProduct(data);
            if (data.sizes?.length) setSelectedSize(data.sizes[0]);
            if (data.colors?.length) setSelectedColor(data.colors[0].name);
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/shop');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product, quantity, selectedSize, selectedColor);
    };

    const handleWishlistClick = async () => {
        if (!user) {
            alert('Please login to add items to your collection');
            return;
        }
        setWishlistLoading(true);
        await toggleWishlist(id);
        setWishlistLoading(false);
    };

    const inWishlist = isInWishlist(id);

    if (loading) {
        return (
            <div className="loading" style={{ minHeight: 'calc(100vh - 80px)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) return null;

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="page">
            <div className="container">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-secondary"
                    style={{ marginBottom: 'var(--spacing-xl)' }}
                >
                    <FiArrowLeft /> Back
                </button>

                <div className="product-detail-layout">
                    {/* Images */}
                    <div>
                        <div style={{
                            aspectRatio: '3/4',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            background: 'var(--color-bg-secondary)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            <img
                                src={product.images?.[activeImage] || 'https://via.placeholder.com/600x800'}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        {product.images?.length > 1 && (
                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        style={{
                                            width: 80,
                                            height: 100,
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            border: activeImage === idx ? '2px solid var(--color-accent)' : '2px solid transparent',
                                            cursor: 'pointer',
                                            padding: 0,
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            <span style={{
                                color: 'var(--color-accent-light)',
                                textTransform: 'uppercase',
                                fontSize: '0.875rem',
                                letterSpacing: '0.05em'
                            }}>
                                {product.category}
                            </span>
                            {product.stock < 10 && product.stock > 0 && (
                                <span style={{
                                    color: 'var(--color-warning)',
                                    fontSize: '0.875rem'
                                }}>
                                    Only {product.stock} left!
                                </span>
                            )}
                        </div>

                        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>
                            {product.name}
                        </h1>

                        {product.rating > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                marginBottom: 'var(--spacing-lg)',
                                color: 'var(--color-text-secondary)'
                            }}>
                                <FiStar fill="var(--color-warning)" color="var(--color-warning)" />
                                <span>{product.rating}</span>
                                <span>({product.numReviews} reviews)</span>
                            </div>
                        )}

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)',
                            marginBottom: 'var(--spacing-xl)'
                        }}>
                            <span style={{ fontSize: '2rem', fontWeight: 700 }}>
                                ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span style={{
                                        fontSize: '1.25rem',
                                        color: 'var(--color-text-muted)',
                                        textDecoration: 'line-through'
                                    }}>
                                        ₹{product.originalPrice.toLocaleString()}
                                    </span>
                                    <span style={{
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        color: 'var(--color-success)',
                                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.875rem',
                                        fontWeight: 500
                                    }}>
                                        {discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <p style={{
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-xl)',
                            lineHeight: 1.8
                        }}>
                            {product.description}
                        </p>

                        {/* Colors */}
                        {product.colors?.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                                    Color: <span style={{ fontWeight: 400 }}>{selectedColor}</span>
                                </h4>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 'var(--radius-full)',
                                                background: color.hex,
                                                border: selectedColor === color.name
                                                    ? '3px solid var(--color-accent)'
                                                    : '2px solid var(--color-border)',
                                                cursor: 'pointer',
                                                padding: 0,
                                            }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes?.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                                    Size: <span style={{ fontWeight: 400 }}>{selectedSize}</span>
                                </h4>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`btn ${selectedSize === size ? 'btn-primary' : 'btn-secondary'}`}
                                            style={{ minWidth: 50 }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.875rem' }}>
                                Quantity
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <FiMinus />
                                </button>
                                <span className="quantity-value">{quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                >
                                    <FiPlus />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <button
                                className="btn btn-primary btn-lg"
                                style={{ flex: 1 }}
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                <FiShoppingCart />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button
                                className="btn btn-secondary btn-lg btn-icon"
                                onClick={handleWishlistClick}
                                disabled={wishlistLoading}
                                style={{
                                    color: inWishlist ? '#ef4444' : undefined,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <FiHeart fill={inWishlist ? '#ef4444' : 'none'} />
                            </button>
                        </div>

                        {/* Info */}
                        <div style={{
                            marginTop: 'var(--spacing-2xl)',
                            padding: 'var(--spacing-xl)',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--color-border)'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 'var(--spacing-lg)',
                                fontSize: '0.875rem'
                            }}>
                                <div>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Category</span>
                                    <p style={{ marginTop: 4, textTransform: 'capitalize' }}>{product.category}</p>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Gender</span>
                                    <p style={{ marginTop: 4, textTransform: 'capitalize' }}>{product.gender}</p>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Availability</span>
                                    <p style={{
                                        marginTop: 4,
                                        color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)'
                                    }}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </p>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Shipping</span>
                                    <p style={{ marginTop: 4 }}>Free over ₹1000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
