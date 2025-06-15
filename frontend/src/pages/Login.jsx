// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Animation */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '15%',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse',
                zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
                animation: 'float 10s ease-in-out infinite',
                zIndex: 0
            }}></div>

            {/* Login Form */}
            <div className="form-container fade-in" style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '450px',
                width: '100%'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--gradient-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: 'white',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <i className="fas fa-user"></i>
                    </div>
                    <h1 className="form-title">Welcome Back!</h1>
                    <p style={{ 
                        color: 'rgba(26,26,26,1)',
                        fontSize: '1.1rem',
                        margin: '0'
                    }}>
                        Sign in to your IYIP Platform account
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-danger fade-in">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}

                {/* Demo Accounts Info */}
                <div style={{
                    background: 'var(--light-orange)',
                    border: '1px solid var(--accent-orange)',
                    borderRadius: 'var(--border-radius)',
                    padding: '1rem',
                    marginBottom: '2rem'
                }}>
                    <h6 style={{ 
                        color: 'var(--primary-orange)', 
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        <i className="fas fa-info-circle"></i> Demo Accounts
                    </h6>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        <div><strong>Admin:</strong> admin@iyip.com / admin123</div>
                        <div><strong>User:</strong> user@iyip.com / user123</div>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label" style={{color: "rgba(26,26,26,1)"}}>
                            <i className="fas fa-envelope"></i>
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            style={{
                                paddingLeft: '3rem',
                                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3e%3cpath fill=\'%23666\' d=\'M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z\'/%3e%3c/svg%3e")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '12px center',
                                backgroundSize: '16px'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label" style={{color: "rgba(26,26,26,1)"}}>
                            <i className="fas fa-lock"></i>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '3rem',
                                    backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3e%3cpath fill=\'%23666\' d=\'M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z\'/%3e%3c/svg%3e")',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: '12px center',
                                    backgroundSize: '16px'
                                }}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-light)',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'var(--transition)'
                                }}
                                onMouseEnter={(e) => e.target.style.color = 'var(--primary-orange)'}
                                onMouseLeave={(e) => e.target.style.color = 'var(--text-light)'}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem'
                    }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            color: 'rgba(26,26,26,1)'
                        }}>
                            <input 
                                type="checkbox" 
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    accentColor: 'var(--dark-orange)'
                                }}
                            />
                            Remember me
                        </label>
                        <Link 
                            to="/forgot-password" 
                            style={{
                                color: 'var(--primary-orange)',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'var(--transition)'
                            }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{
                                    width: '20px',
                                    height: '20px',
                                    margin: '0 8px 0 0'
                                }}></div>
                                Signing In...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i>
                                Sign In
                            </>
                        )}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{
                            color: "rgba(26,26,26,1)",
                            marginBottom: '1rem' 
                        }}>
                            Don't have an account?
                        </p>
                        <Link 
                            to="/register" 
                            className="btn btn-outline"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fas fa-user-plus"></i>
                            Create New Account
                        </Link>
                    </div>
                </form>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-color)'
                }}>
                    <p style={{ 
                        color: 'var(--text-light)', 
                        fontSize: '0.9rem',
                        margin: '0'
                    }}>
                        © 2024 IYIP Platform. All rights reserved.
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .form-control:focus {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.15) !important;
                }

                .btn:hover {
                    transform: translateY(-3px) !important;
                }

                .fade-in {
                    animation: fadeInUp 0.8s ease-out;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;