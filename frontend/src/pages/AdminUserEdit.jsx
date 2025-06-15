// LANGKAH 3: Buat halaman Edit User untuk Admin
// File: frontend/src/pages/AdminUserEdit.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const AdminUserEdit = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        nim: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: '',
        province: '',
        city: '',
        roleName: 'USER'
    });

    // Redirect jika bukan admin
    useEffect(() => {
        if (currentUser?.roleName !== 'ADMIN') {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    // Load user data
    useEffect(() => {
        if (userId) {
            loadUser();
        }
    }, [userId]);

    const loadUser = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/users/${userId}`);
            const userData = response.data.data || response.data;
            setUser(userData);
            setFormData({
                name: userData.name || '',
                nim: userData.nim || '',
                email: userData.email || '',
                phone: userData.phone || '',
                birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
                gender: userData.gender || '',
                province: userData.province || '',
                city: userData.city || '',
                roleName: userData.roleName || 'USER'
            });
        } catch (error) {
            console.error('Error loading user:', error);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);

            await api.put(`/users/${userId}`, formData);
            setAlert({ type: 'success', message: 'User updated successfully!' });

            // Refresh user data
            loadUser();
        } catch (error) {
            console.error('Error updating user:', error);
            setError(error.response?.data?.message || 'Failed to update user');
        } finally {
            setSaving(false);
        }

        // Clear alert after 3 seconds
        setTimeout(() => setAlert(null), 3000);
    };

    const handleResetPassword = async () => {
        if (!window.confirm('Are you sure you want to reset this user\'s password? A new temporary password will be generated.')) {
            return;
        }

        try {
            await api.post(`/users/${userId}/reset-password`);
            setAlert({ type: 'success', message: 'Password reset successfully! Temporary password sent to user email.' });
        } catch (error) {
            console.error('Error resetting password:', error);
            setAlert({ type: 'error', message: 'Failed to reset password' });
        }

        setTimeout(() => setAlert(null), 3000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    <p className="mt-2 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-3"></i>
                    <p className="text-red-600">{error}</p>
                    <Link to="/admin/users" className="btn btn-primary mt-3">
                        Back to Users
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                to="/admin/users"
                                className="text-gray-500 hover:text-gray-700 mr-4"
                            >
                                <i className="fas fa-arrow-left text-xl"></i>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    <i className="fas fa-user-edit mr-3 text-orange-500"></i>
                                    Edit User
                                </h1>
                                <p className="mt-1 text-gray-600">Update user information and settings</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleResetPassword}
                                className="btn btn-outline-secondary"
                                style={{
                                    border: '1px solid #6c757d',
                                    color: '#6c757d',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    background: 'transparent'
                                }}
                            >
                                <i className="fas fa-key mr-2"></i>
                                Reset Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type} mb-4`} style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        background: alert.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: alert.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${alert.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i>
                        {alert.message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-error mb-4" style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        background: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb'
                    }}>
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        {error}
                    </div>
                )}

                {/* User Form */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold mr-3">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            {user?.name} Profile
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        NIM (Student ID)
                                    </label>
                                    <input
                                        type="text"
                                        name="nim"
                                        value={formData.nim}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role *
                                    </label>
                                    <select
                                        name="roleName"
                                        value={formData.roleName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Birth Date
                                    </label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="laki-laki">Male</option>
                                        <option value="perempuan">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Province
                                    </label>
                                    <input
                                        type="text"
                                        name="province"
                                        value={formData.province}
                                        onChange={handleInputChange}
                                        placeholder="e.g., West Java"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Bandung"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                {/* User Stats */}
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Account Information</h4>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <p><strong>User ID:</strong> {user?.userId}</p>
                                        <p><strong>Registered:</strong> {user?.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'N/A'}</p>
                                        <p><strong>Last Updated:</strong> {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                            <Link
                                to="/admin/users"
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin mr-2"></i>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save mr-2"></i>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Admin Actions */}
                <div className="bg-white rounded-lg shadow mt-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Admin Actions</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={handleResetPassword}
                                className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 text-left"
                            >
                                <i className="fas fa-key text-yellow-600 text-xl mb-2"></i>
                                <h3 className="font-medium text-gray-900">Reset Password</h3>
                                <p className="text-sm text-gray-600">Generate new temporary password</p>
                            </button>

                            <Link
                                to={`/admin/users/${userId}/activity`}
                                className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 text-left block"
                            >
                                <i className="fas fa-history text-blue-600 text-xl mb-2"></i>
                                <h3 className="font-medium text-gray-900">View Activity</h3>
                                <p className="text-sm text-gray-600">Check user activity logs</p>
                            </Link>

                            <button
                                onClick={() => window.confirm('This will permanently delete the user. Are you sure?') && handleDeleteUser(userId)}
                                className="p-4 border border-red-200 rounded-lg hover:bg-red-50 text-left"
                            >
                                <i className="fas fa-trash text-red-600 text-xl mb-2"></i>
                                <h3 className="font-medium text-gray-900">Delete User</h3>
                                <p className="text-sm text-gray-600">Permanently remove user</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserEdit;