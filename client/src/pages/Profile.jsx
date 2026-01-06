import { useEffect, useState } from 'react';
import { FiPackage, FiUser, FiMapPin, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import PageHeader from '../components/PageHeader';

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await ordersAPI.getAll();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to request cancellation for this order?')) {
            try {
                await ordersAPI.cancelRequest(orderId);
                setOrders(orders.map(o =>
                    (o._id === orderId || o.id === orderId) ? { ...o, status: 'cancel_requested' } : o
                ));
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to request cancellation');
            }
        }
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <PageHeader
                title="My Account"
                subtitle={`Welcome back, ${user?.name}`}
                breadcrumbs={[{ label: 'Profile' }]}
            />
            <div className="page" style={{ paddingTop: 0 }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--spacing-2xl)' }}>
                        {/* Sidebar */}
                        <div>
                            <div className="auth-card" style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-lg)',
                                    fontSize: '2rem',
                                    fontWeight: 600
                                }}>
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt=""
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-full)' }}
                                        />
                                    ) : (
                                        user?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>{user?.name}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                    {user?.email}
                                </p>
                                {user?.role === 'admin' && (
                                    <span style={{
                                        display: 'inline-block',
                                        marginTop: 'var(--spacing-md)',
                                        padding: 'var(--spacing-xs) var(--spacing-md)',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--color-accent)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        fontWeight: 500
                                    }}>
                                        Admin
                                    </span>
                                )}
                            </div>

                            <div className="admin-nav" style={{ marginTop: 'var(--spacing-lg)' }}>
                                <button
                                    className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <FiPackage /> Orders
                                </button>
                                <button
                                    className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <FiUser /> Profile
                                </button>
                                <button
                                    className={`admin-nav-item ${activeTab === 'address' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('address')}
                                >
                                    <FiMapPin /> Addresses
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            {activeTab === 'orders' && (
                                <div>
                                    <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>My Orders</h2>

                                    {loading ? (
                                        <div className="loading">
                                            <div className="spinner"></div>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-icon">
                                                <FiPackage />
                                            </div>
                                            <h3 className="empty-title">No orders yet</h3>
                                            <p className="empty-description">
                                                You haven't placed any orders yet. Start shopping!
                                            </p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                                            {orders.map((order) => (
                                                <div
                                                    key={order._id}
                                                    className="auth-card"
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: 'var(--spacing-lg)',
                                                        paddingBottom: 'var(--spacing-lg)',
                                                        borderBottom: '1px solid var(--color-border)'
                                                    }}>
                                                        <div>
                                                            <p style={{
                                                                fontSize: '0.75rem',
                                                                color: 'var(--color-text-secondary)',
                                                                marginBottom: 4
                                                            }}>
                                                                Order #{order._id.slice(-8).toUpperCase()}
                                                            </p>
                                                            <p style={{ fontSize: '0.875rem' }}>
                                                                {formatDate(order.createdAt)}
                                                            </p>
                                                        </div>
                                                        <span className={getStatusClass(order.status)}>
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                                        {order.items.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}
                                                            >
                                                                <div style={{
                                                                    width: 60,
                                                                    height: 75,
                                                                    borderRadius: 'var(--radius-sm)',
                                                                    overflow: 'hidden',
                                                                    background: 'var(--color-bg-tertiary)'
                                                                }}>
                                                                    <img
                                                                        src={item.image || 'https://via.placeholder.com/60x75'}
                                                                        alt=""
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                    />
                                                                </div>
                                                                <div style={{ flex: 1 }}>
                                                                    <p style={{ marginBottom: 4 }}>{item.name}</p>
                                                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                                                        Qty: {item.quantity}
                                                                        {item.size && ` • Size: ${item.size}`}
                                                                    </p>
                                                                </div>
                                                                <p style={{ fontWeight: 500 }}>
                                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginTop: 'var(--spacing-lg)',
                                                        paddingTop: 'var(--spacing-lg)',
                                                        borderTop: '1px solid var(--color-border)'
                                                    }}>
                                                        <div>
                                                            <span style={{ color: 'var(--color-text-secondary)' }}>Total: </span>
                                                            <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                                                                ₹{order.totalPrice.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        {['pending', 'processing'].includes(order.status) && (
                                                            <button
                                                                onClick={() => handleCancelOrder(order._id || order.id)}
                                                                className="btn btn-secondary btn-sm"
                                                                style={{ color: 'var(--color-error)' }}
                                                            >
                                                                <FiX size={14} /> Cancel Order
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div>
                                    <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Profile Settings</h2>
                                    <div className="auth-card">
                                        <div className="form-group">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={user?.name || ''}
                                                readOnly
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={user?.email || ''}
                                                readOnly
                                            />
                                        </div>
                                        <button className="btn btn-primary">
                                            Update Profile
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'address' && (
                                <div>
                                    <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>Saved Addresses</h2>
                                    <div className="empty-state" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-xl)' }}>
                                        <div className="empty-icon">
                                            <FiMapPin />
                                        </div>
                                        <h3 className="empty-title">No addresses saved</h3>
                                        <p className="empty-description">
                                            You can save addresses during checkout.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;

