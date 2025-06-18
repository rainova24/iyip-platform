// frontend/src/pages/AddUser.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AddUser = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        nim: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'LAKI_LAKI',
        province: '',
        city: '',
        roleName: 'USER',
        password: ''
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (currentUser?.roleName !== 'ADMIN') {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!formData.password.trim()) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            console.log('Creating user with data:', formData);

            // Use register endpoint to create new user
            const response = await api.post('/auth/register', formData);
            console.log('Create response:', response);

            setAlert({ type: 'success', message: 'User created successfully!' });

            // Reset form
            setFormData({
                name: '',
                nim: '',
                email: '',
                phone: '',
                birthDate: '',
                gender: 'LAKI_LAKI',
                province: '',
                city: '',
                roleName: 'USER',
                password: ''
            });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/admin/users');
            }, 2000);

        } catch (error) {
            console.error('Error creating user:', error);
            setError(error.response?.data?.message || 'Failed to create user');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 80px)',
            background: 'linear-gradient(135deg, #fff5f2 0%, #fff 50%, #fff5f2 100%)',
            padding: '2rem 0'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 2rem'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                    borderRadius: '16px',
                    padding: '2rem',
                    color: 'white',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <button
                            onClick={() => navigate('/admin/users')}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '1.2rem'
                            }}
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            margin: '0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <i className="fas fa-user-plus"></i>
                            Add New User
                        </h1>
                    </div>
                    <p style={{ margin: '0', opacity: 0.9 }}>
                        Create a new user account in the system
                    </p>
                </div>

                {/* Alert */}
                {alert && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: alert.type === 'error' ? '#f8d7da' : '#d4edda',
                        color: alert.type === 'error' ? '#721c24' : '#155724',
                        border: `1px solid ${alert.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`
                    }}>
                        <i className={`fas fa-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`}></i>
                        {alert.message}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        background: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb'
                    }}>
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                {/* Form */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            {/* Name */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>

                            {/* NIM */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    NIM/Username
                                </label>
                                <input
                                    type="text"
                                    name="nim"
                                    value={formData.nim}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength="6"
                                    placeholder="Minimum 6 characters"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 081234567890"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>

                            {/* Birth Date */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Birth Date
                                </label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box',
                                        backgroundColor: 'white'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                >
                                    <option value="LAKI_LAKI">Laki-laki</option>
                                    <option value="PEREMPUAN">Perempuan</option>
                                </select>
                            </div>

                            {/* Role */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Role *
                                </label>
                                <select
                                    name="roleName"
                                    value={formData.roleName}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box',
                                        backgroundColor: 'white'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                >
                                    <option value="USER">Regular User</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>

                            {/* Province */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    Province
                                </label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Jawa Barat"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Bandung"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'flex-end',
                            marginTop: '2rem'
                        }}>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: '2px solid #6c757d',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    color: '#6c757d',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.background = '#6c757d';
                                    e.target.style.color = 'white';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = '#6c757d';
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: saving ? '#ccc' : '#ff6b35',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                                onMouseOver={(e) => {
                                    if (!saving) e.target.style.background = '#e55a2b';
                                }}
                                onMouseOut={(e) => {
                                    if (!saving) e.target.style.background = '#ff6b35';
                                }}
                            >
                                {saving && (
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid transparent',
                                        borderTop: '2px solid white',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                )}
                                {saving ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AddUser;