// File: frontend/src/pages/UserInfo.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/userinfo.css';

const UserInfo = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nim: '',
        birthDate: '',
        gender: '',
        phone: '',
        province: '',
        city: ''
    });

    // Load current user profile
    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users/profile');
            const userData = response.data;

            setCurrentUser(userData);
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                nim: userData.nim || '',
                birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
                gender: userData.gender || '',
                phone: userData.phone || '',
                province: userData.province || '',
                city: userData.city || ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Gagal memuat profil: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);

            // Prepare update data (exclude email as it's usually not updatable)
            const updateData = {
                name: formData.name,
                nim: formData.nim,
                birthDate: formData.birthDate,
                gender: formData.gender,
                phone: formData.phone,
                province: formData.province,
                city: formData.city
            };

            console.log('Updating profile with data:', updateData);

            const response = await api.put('/users/profile', updateData);

            if (response.data) {
                setCurrentUser(response.data);
                setIsEditing(false);
                alert('Profil berhasil diperbarui!');

                // Reload profile to get fresh data
                await loadUserProfile();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Gagal memperbarui profil: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to current user data
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                email: currentUser.email || '',
                nim: currentUser.nim || '',
                birthDate: currentUser.birthDate ? currentUser.birthDate.split('T')[0] : '',
                gender: currentUser.gender || '',
                phone: currentUser.phone || '',
                province: currentUser.province || '',
                city: currentUser.city || ''
            });
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #fff5f2 0%, #fff 50%, #fff5f2 100%)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #ff6b35',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: 'calc(100vh - 80px)',
            background: 'linear-gradient(135deg, #fff5f2 0%, #fff 50%, #fff5f2 100%)',
            padding: '2rem 0'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {/* Profile Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                            borderRadius: '15px',
                            padding: '2rem',
                            color: 'white',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>
                            <div className="profile-avatar" style={{
                                width: '120px',
                                height: '120px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '48px',
                                fontWeight: 'bold',
                                margin: '0 auto 1rem',
                                border: '4px solid rgba(255, 255, 255, 0.3)'
                            }}>
                                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <h2 style={{ marginBottom: '0.5rem' }}>{currentUser?.name || 'User'}</h2>
                            <p style={{ margin: '0', opacity: '0.9' }}>{currentUser?.email || ''}</p>
                            <span style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                marginTop: '1rem',
                                display: 'inline-block'
                            }}>
                                {currentUser?.roleName || 'USER'}
                            </span>
                        </div>

                        {/* Profile Information Card */}
                        <div className="card user-profile-card">
                            <div className="card-header" style={{
                                background: '#f8f9fa',
                                borderBottom: '1px solid #dee2e6'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h5 style={{ margin: '0', color: '#333' }}>
                                        <i className="fas fa-user-circle" style={{ marginRight: '0.5rem', color: '#FF6B35' }}></i>
                                        Profile Information
                                    </h5>
                                    {!isEditing ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setIsEditing(true)}
                                            style={{
                                                background: '#FF6B35',
                                                borderColor: '#FF6B35'
                                            }}
                                        >
                                            <i className="fas fa-edit"></i> Edit Profile
                                        </button>
                                    ) : (
                                        <div>
                                            <button
                                                className="btn btn-light me-2"
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                <i className="fas fa-times"></i> Cancel
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                onClick={handleUpdate}
                                                disabled={saving}
                                                style={{
                                                    background: '#28a745',
                                                    borderColor: '#28a745'
                                                }}
                                            >
                                                {saving ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save"></i> Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="card-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="user-info-grid">
                                        {/* Name */}
                                        <div className="info-item">
                                            <label>Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    required
                                                />
                                            ) : (
                                                <p>{currentUser?.name || '-'}</p>
                                            )}
                                        </div>

                                        {/* Email (Read-only) */}
                                        <div className="info-item">
                                            <label>Email</label>
                                            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                                                {currentUser?.email || '-'} (cannot be changed)
                                            </p>
                                        </div>

                                        {/* NIM */}
                                        <div className="info-item">
                                            <label>NIM</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="nim"
                                                    value={formData.nim}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                <p>{currentUser?.nim || '-'}</p>
                                            )}
                                        </div>

                                        {/* Birth Date */}
                                        <div className="info-item">
                                            <label>Birth Date</label>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    name="birthDate"
                                                    value={formData.birthDate}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                <p>{currentUser?.birthDate ? new Date(currentUser.birthDate).toLocaleDateString('id-ID') : '-'}</p>
                                            )}
                                        </div>

                                        {/* Gender */}
                                        <div className="info-item">
                                            <label>Gender</label>
                                            {isEditing ? (
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="LAKI_LAKI">Laki-laki</option>
                                                    <option value="PEREMPUAN">Perempuan</option>
                                                </select>
                                            ) : (
                                                <p>{currentUser?.gender === 'LAKI_LAKI' ? 'Laki-laki' :
                                                    currentUser?.gender === 'PEREMPUAN' ? 'Perempuan' :
                                                        currentUser?.gender || '-'}</p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div className="info-item">
                                            <label>Phone</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                <p>{currentUser?.phone || '-'}</p>
                                            )}
                                        </div>

                                        {/* Province */}
                                        <div className="info-item">
                                            <label>Province</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="province"
                                                    value={formData.province}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                <p>{currentUser?.province || '-'}</p>
                                            )}
                                        </div>

                                        {/* City */}
                                        <div className="info-item">
                                            <label>City</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                <p>{currentUser?.city || '-'}</p>
                                            )}
                                        </div>

                                        {/* Role (Read-only) */}
                                        <div className="info-item">
                                            <label>Role</label>
                                            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                                                {currentUser?.roleName || 'USER'} (system assigned)
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="card mt-3">
                            <div className="card-header" style={{
                                background: '#f8f9fa',
                                borderBottom: '1px solid #dee2e6'
                            }}>
                                <h5 style={{ margin: '0', color: '#333' }}>
                                    <i className="fas fa-shield-alt" style={{ marginRight: '0.5rem', color: '#dc3545' }}></i>
                                    Account Actions
                                </h5>
                            </div>
                            <div className="card-body">
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
                                        For password changes or account deletion, please contact the administrator.
                                    </p>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to logout?')) {
                                                logout();
                                                navigate('/');
                                            }
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;