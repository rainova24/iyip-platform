// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <>
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">
                        <span>🎓</span> IYIP Platform
                    </Link>
                    <nav>
                        <ul className="nav-menu">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="container">
                <div className="panel" style={{ maxWidth: '450px', margin: '3rem auto' }}>
                    <h1 className="panel-header">Login</h1>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                            <button
                                className="alert-close"
                                onClick={() => setError('')}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="user@iyip.com"
                                required
                                disabled={loading}
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    <span style={{ marginLeft: '0.5rem' }}>Logging in...</span>
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>

                        <p className="text-center mt-3">
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: 'var(--primary-orange)' }}>
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            <footer className="footer">
                <p>&copy; 2024 IYIP Platform. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Login;