import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiHome, FiPackage, FiShoppingBag, FiUsers, FiPlus,
    FiEdit2, FiTrash2, FiDollarSign, FiLogOut, FiX, FiCheck
} from 'react-icons/fi';
import { adminAPI, productsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', description: '', price: '', originalPrice: '',
        category: 'hoodies', gender: 'men', stock: '', images: '', sizes: '', featured: false
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const { data } = await adminAPI.getStats();
                setStats(data);
            } else if (activeTab === 'products') {
                const { data } = await productsAPI.getAll();
                setProducts(data);
            } else if (activeTab === 'orders') {
                const { data } = await ordersAPI.getAllAdmin();
                setOrders(data);
            } else if (activeTab === 'users') {
                const { data } = await adminAPI.getUsers();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                originalPrice: Number(newProduct.originalPrice) || undefined,
                stock: Number(newProduct.stock),
                images: newProduct.images.split(',').map(url => url.trim()),
                sizes: newProduct.sizes.split(',').map(s => s.trim()),
                colors: [{ name: 'Default', hex: '#1a1a1a' }],
            };
            await productsAPI.create(productData);
            setShowAddProduct(false);
            setNewProduct({ name: '', description: '', price: '', originalPrice: '', category: 'hoodies', gender: 'men', stock: '', images: '', sizes: '', featured: false });
            fetchData();
        } catch (error) {
            alert('Error adding product: ' + error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productsAPI.delete(id);
                setProducts(products.filter(p => p.id !== id && p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            await ordersAPI.updateStatus(orderId, status);
            setOrders(orders.map(o =>
                (o._id === orderId || o.id === orderId) ? { ...o, status } : o
            ));
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
        });
    };

    return (
        <div className="admin-layout">
            {/* Mobile Header */}
            <div className="admin-mobile-header">
                <h3>Admin Panel</h3>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    <FiLogOut size={16} />
                </button>
            </div>

            {/* Sidebar - Desktop */}
            <aside className="admin-sidebar">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-xs)' }}>Admin Panel</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{user?.email}</p>
                </div>
                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <FiHome /> Dashboard
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <FiShoppingBag /> Products
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <FiPackage /> Orders
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <FiUsers /> Users
                    </button>
                    <button className="admin-nav-item" onClick={handleLogout} style={{ marginTop: 'auto', color: 'var(--color-error)' }}>
                        <FiLogOut /> Logout
                    </button>
                </nav>
            </aside>

            {/* Mobile Bottom Nav */}
            <div className="admin-mobile-nav">
                <nav className="admin-nav">
                    <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <FiHome size={20} /> Dashboard
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <FiShoppingBag size={20} /> Products
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <FiPackage size={20} /> Orders
                    </button>
                    <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <FiUsers size={20} /> Users
                    </button>
                </nav>
            </div>

            {/* Content */}
            <main className="admin-content">
                {loading ? (
                    <div className="loading"><div className="spinner"></div></div>
                ) : (
                    <>
                        {/* Dashboard */}
                        {activeTab === 'dashboard' && stats && (
                            <div>
                                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Dashboard</h1>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-icon"><FiDollarSign size={24} /></div>
                                        <div className="stat-value">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
                                        <div className="stat-label">Total Revenue</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon"><FiPackage size={24} /></div>
                                        <div className="stat-value">{stats.totalOrders || 0}</div>
                                        <div className="stat-label">Total Orders</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon"><FiShoppingBag size={24} /></div>
                                        <div className="stat-value">{stats.totalProducts || 0}</div>
                                        <div className="stat-label">Products</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon"><FiUsers size={24} /></div>
                                        <div className="stat-value">{stats.totalUsers || 0}</div>
                                        <div className="stat-label">Customers</div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                                    <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Orders</h3>
                                    <table className="data-table">
                                        <thead>
                                            <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders?.map((order) => (
                                                <tr key={order._id || order.id}>
                                                    <td>#{(order._id || order.id).slice(-8).toUpperCase()}</td>
                                                    <td>{order.user?.name || 'N/A'}</td>
                                                    <td>₹{order.totalPrice?.toLocaleString()}</td>
                                                    <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                                                    <td>{formatDate(order.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Products */}
                        {activeTab === 'products' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                                    <h1>Products ({products.length})</h1>
                                    <button className="btn btn-primary" onClick={() => setShowAddProduct(true)}><FiPlus /> Add Product</button>
                                </div>

                                {/* Add Product Modal */}
                                {showAddProduct && (
                                    <div className="modal-overlay" onClick={() => setShowAddProduct(false)}>
                                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                                                <h3>Add New Product</h3>
                                                <button onClick={() => setShowAddProduct(false)} className="btn btn-secondary btn-icon btn-sm"><FiX size={20} /></button>
                                            </div>
                                            <form onSubmit={handleAddProduct}>
                                                <div className="form-group">
                                                    <label className="form-label">Name</label>
                                                    <input className="form-input" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Description</label>
                                                    <textarea className="form-input" rows={2} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} required />
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Price (₹)</label>
                                                        <input type="number" className="form-input" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Original Price</label>
                                                        <input type="number" className="form-input" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group">
                                                        <label className="form-label">Category</label>
                                                        <select className="form-input" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                                                            <option value="hoodies">Hoodies</option>
                                                            <option value="t-shirts">T-Shirts</option>
                                                            <option value="shorts">Shorts</option>
                                                            <option value="pants">Pants</option>
                                                            <option value="jackets">Jackets</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Gender</label>
                                                        <select className="form-input" value={newProduct.gender} onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}>
                                                            <option value="men">Men</option>
                                                            <option value="women">Women</option>
                                                            <option value="unisex">Unisex</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-label">Stock</label>
                                                        <input type="number" className="form-input" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} required />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Image URL</label>
                                                    <input className="form-input" placeholder="https://..." value={newProduct.images} onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label">Sizes (comma separated)</label>
                                                    <input className="form-input" placeholder="S, M, L, XL" value={newProduct.sizes} onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })} />
                                                </div>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                                                    <input type="checkbox" checked={newProduct.featured} onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })} />
                                                    Featured Product
                                                </label>
                                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Add Product</button>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                <table className="data-table">
                                    <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product._id || product.id}>
                                                <td>
                                                    <div style={{ width: 50, height: 60, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-bg-tertiary)' }}>
                                                        <img src={product.images?.[0] || 'https://via.placeholder.com/50x60'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                </td>
                                                <td>{product.name}</td>
                                                <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                                                <td>₹{product.price?.toLocaleString()}</td>
                                                <td><span style={{ color: product.stock < 10 ? 'var(--color-warning)' : 'var(--color-success)' }}>{product.stock}</span></td>
                                                <td>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => handleDeleteProduct(product._id || product.id)} style={{ color: 'var(--color-error)' }}><FiTrash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Orders */}
                        {activeTab === 'orders' && (
                            <div>
                                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Orders ({orders.length})</h1>
                                <table className="data-table">
                                    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id || order.id}>
                                                <td>#{(order._id || order.id).slice(-8).toUpperCase()}</td>
                                                <td>
                                                    <div>
                                                        <p>{order.user?.name || 'N/A'}</p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{order.user?.email}</p>
                                                    </div>
                                                </td>
                                                <td>{order.items?.length} items</td>
                                                <td>₹{order.totalPrice?.toLocaleString()}</td>
                                                <td>
                                                    <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order._id || order.id, e.target.value)} className="form-input" style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.875rem', width: 'auto' }}>
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td>{formatDate(order.createdAt)}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => handleUpdateOrderStatus(order._id || order.id, 'delivered')} title="Mark Delivered"><FiCheck size={14} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Users */}
                        {activeTab === 'users' && (
                            <div>
                                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Users ({users.length})</h1>
                                <table className="data-table">
                                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u._id || u.id}>
                                                <td>{u.name}</td>
                                                <td>{u.email}</td>
                                                <td><span className={`status-badge ${u.role === 'admin' ? 'status-processing' : 'status-delivered'}`}>{u.role}</span></td>
                                                <td>{formatDate(u.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Admin;
