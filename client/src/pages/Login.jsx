import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { FiShoppingBag } from 'react-icons/fi';

const Login = () => {
    const navigate = useNavigate();
    const { googleLogin, isAuthenticated, isAdmin } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const userData = await googleLogin(credentialResponse.credential);
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign-In failed');
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: 'var(--spacing-md)',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            <FiShoppingBag />
                        </div>
                        <h1 className="auth-title">Welcome to URBANFIT</h1>
                        <p className="auth-subtitle">Sign in to continue shopping</p>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 'var(--spacing-xl)'
                    }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            size="large"
                            text="continue_with"
                            shape="pill"
                            width="300"
                        />
                    </div>

                    <p style={{
                        textAlign: 'center',
                        marginTop: 'var(--spacing-xl)',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.8rem'
                    }}>
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
