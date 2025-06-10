// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        nim: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        birthDate: '',
        gender: '',
        province: '',
        city: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Name, email, and password are required');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        const { confirmPassword, ...registrationData } = formData;
        const result = await register(registrationData);

        if (result.success) {
            // Show success message and redirect to login
            navigate('/login', {
                state: { message: 'Registration successful! Please login.' }
            });
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
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="container">
                <div className="panel" style={{ maxWidth: '600px', margin: '2rem auto' }}>
                    <h1 className="panel-header">Create New Account</h1>

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
                        {/* Basic Information */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                                Basic Information
                            </h3>

                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nim">NIM (Student ID)</label>
                                <input
                                    type="text"
                                    id="nim"
                                    name="nim"
                                    value={formData.nim}
                                    onChange={handleChange}
                                    placeholder="Enter your NIM"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Security */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                                Security
                            </h3>

                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="At least 6 characters"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                                Additional Information (Optional)
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+62 xxx xxx xxxx"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="birthDate">Birth Date</label>
                                    <input
                                        type="date"
                                        id="birthDate"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Laki-laki">Male</option>
                                        <option value="Perempuan">Female</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="province">Province</label>
                                    <input
                                        type="text"
                                        id="province"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleChange}
                                        placeholder="e.g., West Java"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="e.g., Bandung"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
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
                                    <span style={{ marginLeft: '0.5rem' }}>Creating Account...</span>
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <p className="text-center mt-3">
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: 'var(--primary-orange)' }}>
                                Login here
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

export default Register;