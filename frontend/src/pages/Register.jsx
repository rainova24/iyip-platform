// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // Default import, bukan { authService }

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // Remove confirmPassword from data sent to backend
            const { confirmPassword, ...registrationData } = formData;

            // Call the register method from authService
            const response = await authService.register(registrationData);

            // Show success message or redirect
            alert('Registration successful! Please login to continue.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);

            if (error.response?.data?.message) {
                setErrors({ submit: error.response.data.message });
            } else if (error.response?.data?.error) {
                setErrors({ submit: error.response.data.error });
            } else {
                setErrors({ submit: 'Registration failed. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-form-wrapper">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="logo-icon">I</div>
                            <span className="logo-text">IYIP Platform</span>
                        </div>
                        <h1 className="auth-title">Create New Account</h1>
                        <p className="auth-subtitle">Join Itenas Youth Innovation Platform</p>
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {errors.submit && (
                            <div className="alert alert-error">
                                <i className="icon-error">⚠</i>
                                {errors.submit}
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${errors.name ? 'error' : ''}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                    />
                                    {errors.name && <span className="error-text">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">NIM (Student ID)</label>
                                    <input
                                        type="text"
                                        name="nim"
                                        className="form-control"
                                        value={formData.nim}
                                        onChange={handleChange}
                                        placeholder="Enter your NIM"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Email Address <span className="required">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-control ${errors.email ? 'error' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    disabled={loading}
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                        </div>

                        {/* Security */}
                        <div className="form-section">
                            <h3 className="section-title">Security</h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Password <span className="required">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`form-control ${errors.password ? 'error' : ''}`}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Minimum 6 characters"
                                        disabled={loading}
                                    />
                                    {errors.password && <span className="error-text">{errors.password}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Confirm Password <span className="required">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter your password"
                                        disabled={loading}
                                    />
                                    {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="form-section">
                            <h3 className="section-title">Additional Information <span className="optional">(Optional)</span></h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+62 xxx xxx xxxx"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        className="form-control"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select
                                        name="gender"
                                        className="form-control"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="LAKI_LAKI">Male</option>
                                        <option value="PEREMPUAN">Female</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        className="form-control"
                                        value={formData.province}
                                        onChange={handleChange}
                                        placeholder="e.g., West Java"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g., Bandung"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="auth-footer">
                            <p>
                                Already have an account?{' '}
                                <Link to="/login" className="auth-link">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Decorative Side */}
                <div className="auth-decoration">
                    <div className="decoration-content">
                        <h2>Welcome to IYIP</h2>
                        <p>Join our community of young innovators and researchers at Itenas.</p>
                        <div className="decoration-features">
                            <div className="feature-item">
                                <div className="feature-icon">📚</div>
                                <span>Access Research Journals</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🎯</div>
                                <span>Join Innovation Events</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">🤝</div>
                                <span>Connect with Communities</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;