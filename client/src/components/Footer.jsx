import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">URBANFIT</div>
                        <p className="footer-description">
                            Premium streetwear and casual clothing for the modern generation.
                            Discover your unique style with our curated collection of hoodies,
                            t-shirts, and more.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4>Shop</h4>
                        <div className="footer-links">
                            <Link to="/shop?gender=men" className="footer-link">Men</Link>
                            <Link to="/shop?gender=women" className="footer-link">Women</Link>
                            <Link to="/shop?category=hoodies" className="footer-link">Hoodies</Link>
                            <Link to="/shop?category=t-shirts" className="footer-link">T-Shirts</Link>
                            <Link to="/shop?category=shorts" className="footer-link">Shorts</Link>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Help</h4>
                        <div className="footer-links">
                            <Link to="#" className="footer-link">Contact Us</Link>
                            <Link to="#" className="footer-link">FAQs</Link>
                            <Link to="#" className="footer-link">Shipping</Link>
                            <Link to="#" className="footer-link">Returns</Link>
                            <Link to="#" className="footer-link">Size Guide</Link>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h4>Company</h4>
                        <div className="footer-links">
                            <Link to="#" className="footer-link">About Us</Link>
                            <Link to="#" className="footer-link">Careers</Link>
                            <Link to="#" className="footer-link">Privacy Policy</Link>
                            <Link to="#" className="footer-link">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 URBANFIT. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="#" className="footer-link"><FiInstagram size={20} /></a>
                        <a href="#" className="footer-link"><FiTwitter size={20} /></a>
                        <a href="#" className="footer-link"><FiFacebook size={20} /></a>
                        <a href="#" className="footer-link"><FiYoutube size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
