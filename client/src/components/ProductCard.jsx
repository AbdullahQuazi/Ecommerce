import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1, product.sizes?.[0], product.colors?.[0]?.name);

        // Show "Added" feedback
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link to={`/product/${product.id || product._id}`} className="product-card">
            <div className="product-image">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300x400'}
                    alt={product.name}
                />
                {discount > 0 && (
                    <span className="product-badge">-{discount}%</span>
                )}
                <div className="product-actions">
                    <button
                        className={`btn ${added ? 'btn-success' : 'btn-primary'} btn-sm`}
                        style={{ flex: 1 }}
                        onClick={handleAddToCart}
                    >
                        {added ? (
                            <>
                                <FiCheck size={16} />
                                Added!
                            </>
                        ) : (
                            <>
                                <FiShoppingCart size={16} />
                                Add to Cart
                            </>
                        )}
                    </button>
                    <button className="btn btn-secondary btn-icon btn-sm">
                        <FiHeart size={16} />
                    </button>
                </div>
            </div>
            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                    <span className="price-current">₹{product.price?.toLocaleString()}</span>
                    {product.originalPrice && (
                        <span className="price-original">₹{product.originalPrice?.toLocaleString()}</span>
                    )}
                </div>
                {product.rating > 0 && (
                    <div className="product-rating">
                        <FiStar fill="currentColor" />
                        <span>{product.rating}</span>
                        <span>({product.numReviews})</span>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
