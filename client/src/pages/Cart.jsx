import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiX, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
    const { isAuthenticated } = useAuth();

    const shippingPrice = cartTotal > 1000 ? 0 : 100;
    const taxPrice = Math.round(cartTotal * 0.18);
    const totalPrice = cartTotal + shippingPrice + taxPrice;

    if (cart.length === 0) {
        return (
            <>
                <PageHeader
                    title="Shopping Cart"
                    breadcrumbs={[{ label: 'Cart' }]}
                />
                <div className="page" style={{ paddingTop: 0 }}>
                    <div className="container">
                        <div className="empty-state">
                            <div className="empty-icon">
                                <FiShoppingBag />
                            </div>
                            <h2 className="empty-title">Your cart is empty</h2>
                            <p className="empty-description">
                                Looks like you haven't added anything to your cart yet.
                            </p>
                            <Link to="/shop" className="btn btn-primary">
                                Start Shopping <FiArrowRight />
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
                title={`Shopping Cart (${cartCount} items)`}
                breadcrumbs={[{ label: 'Cart' }]}
            />
            <div className="cart-page" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div className="cart-layout">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <div className="cart-item-image">
                                        <img
                                            src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                                            alt={item.product?.name}
                                        />
                                    </div>
                                    <div className="cart-item-info">
                                        <h3 className="cart-item-name">{item.product?.name}</h3>
                                        <p className="cart-item-details">
                                            {item.size && `Size: ${item.size}`}
                                            {item.size && item.color && ' • '}
                                            {item.color && `Color: ${item.color}`}
                                        </p>
                                        <div className="cart-item-quantity">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                            >
                                                <FiMinus size={14} />
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            >
                                                <FiPlus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-price">
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <FiX size={20} />
                                        </button>
                                        <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                                            ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="cart-summary">
                            <h3 className="summary-title">Order Summary</h3>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                            </div>
                            <div className="summary-row">
                                <span>Estimated Tax (18%)</span>
                                <span>₹{taxPrice.toLocaleString()}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{totalPrice.toLocaleString()}</span>
                            </div>

                            {cartTotal < 1000 && (
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: 'var(--spacing-lg)',
                                    textAlign: 'center'
                                }}>
                                    Add ₹{(1000 - cartTotal).toLocaleString()} more for free shipping!
                                </p>
                            )}

                            {isAuthenticated ? (
                                <Link
                                    to="/checkout"
                                    className="btn btn-primary btn-lg"
                                    style={{ width: '100%' }}
                                >
                                    Proceed to Checkout
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn btn-primary btn-lg"
                                    style={{ width: '100%' }}
                                >
                                    Login to Checkout
                                </Link>
                            )}

                            <Link
                                to="/shop"
                                className="btn btn-secondary btn-lg"
                                style={{ width: '100%', marginTop: 'var(--spacing-md)' }}
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
