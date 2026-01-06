import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiSun, FiMoon, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, logout } = useAuth();
    const { totalItems } = useCart();
    const { isDark, toggleTheme } = useTheme();
    const { wishlistCount } = useWishlist();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Don't render navbar for admin - admin has its own sidebar
    if (isAdmin) {
        return null;
    }

    return (
        <header className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-logo">
                    URBANFIT
                </Link>

                <nav className="navbar-links">
                    <Link to="/" className="navbar-link">Home</Link>
                    <Link to="/shop" className="navbar-link">Shop</Link>
                    <Link to="/shop?category=hoodies" className="navbar-link">Hoodies</Link>
                    <Link to="/shop?category=t-shirts" className="navbar-link">T-Shirts</Link>
                </nav>

                <div className="navbar-actions">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>

                    {/* Wishlist/Collection Link */}
                    <Link to="/collection" className="cart-badge" style={{ color: wishlistCount > 0 ? '#ef4444' : undefined }}>
                        <FiHeart size={22} fill={wishlistCount > 0 ? '#ef4444' : 'none'} />
                        {wishlistCount > 0 && <span className="cart-count" style={{ background: '#ef4444' }}>{wishlistCount}</span>}
                    </Link>

                    <Link to="/cart" className="cart-badge">
                        <FiShoppingCart size={22} />
                        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="navbar-link">
                                <FiUser size={20} />
                            </Link>
                            <button onClick={handleLogout} className="btn btn-secondary">
                                <FiLogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Sign In</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;

