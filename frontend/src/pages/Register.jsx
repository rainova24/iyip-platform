// frontend/src/pages/Register.jsx - Enhanced version with admin features
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        nim: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: '',
        gender: '',
        phone: '',
        province: '',
        city: ''
    });

    const isAdmin = user?.roleName === 'ADMIN';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            // Prepare data for submission
            const submitData = {
                name: formData.name,
                nim: formData.nim,
                email: formData.email,
                password: formData.password,
                birthDate: formData.birthDate || null,
                gender: formData.gender || null,
                phone: formData.phone || null,
                province: formData.province || null,
                city: formData.city || null
            };

            console.log('Submitting registration data:', submitData);

            const response = await api.post('/auth/register', submitData);
            console.log('Registration response:', response.data);

            setSuccess('User registered successfully!');

            // If admin is creating user, redirect to user management
            if (isAdmin) {
                setTimeout(() => {
                    navigate('/admin/users');
                }, 2000);
            } else {
                // Regular registration flow
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }

        } catch (error) {
            console.error('Registration error:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div className="logo-icon">I</div>
                            <span className="logo-text">IYIP</span>
                        </div>
                        <h1 className="auth-title">
                            {isAdmin ? 'Add New User' : 'Create Account'}
                        </h1>
                        <p className="auth-subtitle">
                            {isAdmin
                                ? 'Create a new user account for the platform'
                                : 'Join the IYIP Platform community today'
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            <i className="fas fa-exclamation-circle icon-error"></i>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert" style={{
                            background: '#d4edda',
                            color: '#155724',
                            border: '1px solid #c3e6cb'
                        }}>
                            <i className="fas fa-check-circle"></i>
                            {success}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <i className="fas fa-user"></i>
                                Basic Information
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        NIM <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nim"
                                        className="form-control"
                                        value={formData.nim}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter NIM"
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
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Password <span className="required">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter password"
                                        minLength="6"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Confirm Password <span className="required">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <i className="fas fa-id-card"></i>
                                Personal Information <span className="optional">(Optional)</span>
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        className="form-control"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Gender</label>
                                    <select
                                        name="gender"
                                        className="form-control"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="LAKI_LAKI">Male</option>
                                        <option value="PEREMPUAN">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="form-section">
                            <h3 className="section-title">
                                <i className="fas fa-map-marker-alt"></i>
                                Location <span className="optional">(Optional)</span>
                            </h3>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Province</label>
                                    <input
                                        type="text"
                                        name="province"
                                        className="form-control"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        placeholder="Enter province"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-control"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    {isAdmin ? 'Creating User...' : 'Creating Account...'}
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-user-plus"></i>
                                    {isAdmin ? 'Create User' : 'Create Account'}
                                </>
                            )}
                        </button>

                        <div style={{
                            textAlign: 'center',
                            marginTop: '2rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid #E9ECEF'
                        }}>
                            {isAdmin ? (
                                <p style={{ color: '#7F8C8D' }}>
                                    <Link
                                        to="/admin/users"
                                        style={{ color: '#FF6B35', textDecoration: 'none' }}
                                    >
                                        ← Back to User Management
                                    </Link>
                                </p>
                            ) : (
                                <p style={{ color: '#7F8C8D' }}>
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        style={{ color: '#FF6B35', textDecoration: 'none' }}
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            )}
                        </div>
                    </form>
                </div>

                {/* Decoration Section */}
                <div className="auth-decoration">
                    <div className="decoration-content">
                        <h2>Welcome to IYIP Platform</h2>
                        <p>
                            Join our community of innovators, researchers, and students.
                            Create your account to access exclusive features and collaborate
                            with like-minded individuals.
                        </p>

                        <div className="decoration-features">
                            <div className="feature-item">
                                <div className="feature-icon">
                                    <i className="fas fa-journal-whills"></i>
                                </div>
                                <span>Digital Journal Management</span>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <span>Event Registration & Management</span>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <span>Community Collaboration</span>
                            </div>

                            <div className="feature-item">
                                <div className="feature-icon">
                                    <i className="fas fa-upload"></i>
                                </div>
                                <span>Easy Submission System</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;