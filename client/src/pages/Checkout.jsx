import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [address, setAddress] = useState({
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
    });

    const shippingPrice = cartTotal > 1000 ? 0 : 100;
    const taxPrice = Math.round(cartTotal * 0.18);
    const totalPrice = cartTotal + shippingPrice + taxPrice;

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderItems = cart.map((item) => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.images?.[0],
                price: item.product.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
            }));

            await ordersAPI.create({
                items: orderItems,
                shippingAddress: address,
                paymentMethod: 'COD',
            });

            await clearCart();
            setOrderPlaced(true);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="page">
                <div className="container">
                    <div className="empty-state">
                        <div className="empty-icon" style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: 'var(--color-success)'
                        }}>
                            <FiCheck size={40} />
                        </div>
                        <h2 className="empty-title">Order Placed Successfully!</h2>
                        <p className="empty-description">
                            Thank you for your order. You will receive a confirmation email shortly.
                        </p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="btn btn-primary"
                        >
                            View Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="page">
            <div className="container">
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Checkout</h1>

                <div className="cart-layout">
                    {/* Shipping Form */}
                    <div>
                        <div className="auth-card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h3 style={{ marginBottom: 'var(--spacing-xl)' }}>Shipping Address</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        placeholder="Enter your phone number"
                                        value={address.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        className="form-input"
                                        placeholder="Enter your street address"
                                        value={address.street}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="form-input"
                                            placeholder="City"
                                            value={address.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            className="form-input"
                                            placeholder="State"
                                            value={address.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <div className="form-group">
                                        <label className="form-label">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            className="form-input"
                                            placeholder="ZIP Code"
                                            value={address.zipCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            className="form-input"
                                            value={address.country}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{
                                    padding: 'var(--spacing-lg)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: 'var(--spacing-xl)'
                                }}>
                                    <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Payment Method</h4>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                        Cash on Delivery (COD)
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    style={{ width: '100%' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Placing Order...' : `Place Order • ₹${totalPrice.toLocaleString()}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <h3 className="summary-title">Order Summary</h3>

                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            {cart.map((item) => (
                                <div
                                    key={item._id}
                                    style={{
                                        display: 'flex',
                                        gap: 'var(--spacing-md)',
                                        marginBottom: 'var(--spacing-md)',
                                        paddingBottom: 'var(--spacing-md)',
                                        borderBottom: '1px solid var(--color-border)'
                                    }}
                                >
                                    <div style={{
                                        width: 60,
                                        height: 75,
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}>
                                        <img
                                            src={item.product?.images?.[0]}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '0.875rem', marginBottom: 4 }}>{item.product?.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (18%)</span>
                            <span>₹{taxPrice.toLocaleString()}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
