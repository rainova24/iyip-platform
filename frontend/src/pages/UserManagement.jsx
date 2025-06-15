// frontend/src/pages/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (user?.roleName === 'ADMIN') {
            loadUsers();
        }
    }, [user]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            const usersData = response?.data || [];
            setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (error) {
            console.error('Error loading users:', error);
            setError('Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredUsers = () => {
        let filtered = users;

        if (filter === 'admin') {
            filtered = users.filter(u => u.roleName === 'ADMIN');
        } else if (filter === 'user') {
            filtered = users.filter(u => u.roleName === 'USER');
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.nim?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredUsers = getFilteredUsers();

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleBadge = (roleName) => {
        return roleName === 'ADMIN' ? 'badge-danger' : 'badge-primary';
    };

    const handleEditUser = (userData) => {
        setSelectedUser(userData);
        setShowEditModal(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/users/${userId}`);
                setAlert({ type: 'success', message: 'User deleted successfully!' });
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setAlert({ type: 'error', message: 'Failed to delete user' });
            }
            setTimeout(() => setAlert(null), 3000);
        }
    };

    if (user?.roleName !== 'ADMIN') {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Access denied. Admin privileges required.
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="user-management-loading">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p>Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-management-page">
            <div className="user-management-container">
                {/* Header */}
                <div className="user-management-header">
                    <div className="header-content">
                        <h1>
                            <i className="fas fa-users-cog"></i>
                            User Management
                        </h1>
                        <p>Manage all users in the system</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={() => window.location.href = '/register'}>
                            <i className="fas fa-user-plus"></i>
                            Add New User
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="user-management-stats">
                    <div className="stat-item">
                        <span className="stat-number">{users.length}</span>
                        <span className="stat-label">Total Users</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{users.filter(u => u.roleName === 'ADMIN').length}</span>
                        <span className="stat-label">Administrators</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{users.filter(u => u.roleName === 'USER').length}</span>
                        <span className="stat-label">Regular Users</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{users.filter(u => u.createdAt && new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}</span>
                        <span className="stat-label">New (30 days)</span>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type === 'error' ? 'danger' : alert.type}`}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                        {alert.message}
                        <button className="alert-close" onClick={() => setAlert(null)}>×</button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                        <button className="alert-close" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {/* Filters */}
                <div className="user-management-filters">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <i className="fas fa-users"></i>
                            All Users
                        </button>
                        <button
                            className={`filter-tab ${filter === 'admin' ? 'active' : ''}`}
                            onClick={() => setFilter('admin')}
                        >
                            <i className="fas fa-user-shield"></i>
                            Administrators
                        </button>
                        <button
                            className={`filter-tab ${filter === 'user' ? 'active' : ''}`}
                            onClick={() => setFilter('user')}
                        >
                            <i className="fas fa-user"></i>
                            Regular Users
                        </button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Users Table/Grid */}
                <div className="users-grid">
                    {filteredUsers.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>No users found</h3>
                            <p>
                                {filter !== 'all' ? `No ${filter} users found.` : 'No users in the system.'}
                            </p>
                        </div>
                    ) : (
                        filteredUsers.map((userData) => (
                            <div key={userData.userId} className="user-card">
                                <div className="user-card-header">
                                    <div className="user-avatar-large">
                                        {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="user-badges">
                                        <span className={`badge ${getRoleBadge(userData.roleName)}`}>
                                            <i className={userData.roleName === 'ADMIN' ? 'fas fa-user-shield' : 'fas fa-user'}></i>
                                            {userData.roleName}
                                        </span>
                                    </div>
                                </div>

                                <div className="user-card-content">
                                    <h3 className="user-name">{userData.name || 'No Name'}</h3>
                                    <p className="user-email">{userData.email}</p>

                                    <div className="user-details">
                                        <div className="detail-item">
                                            <i className="fas fa-id-card"></i>
                                            <span>{userData.nim || 'No NIM'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-phone"></i>
                                            <span>{userData.phone || 'No Phone'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-map-marker-alt"></i>
                                            <span>{userData.city || userData.province || 'No Location'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <i className="fas fa-calendar"></i>
                                            <span>Joined {formatDate(userData.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="user-card-actions">
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleEditUser(userData)}
                                    >
                                        <i className="fas fa-edit"></i>
                                        Edit
                                    </button>

                                    <button className="btn btn-secondary btn-sm">
                                        <i className="fas fa-eye"></i>
                                        View Profile
                                    </button>

                                    {userData.userId !== user.userId && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteUser(userData.userId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <UserEditModal
                    user={selectedUser}
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onUserUpdate={(updatedUser) => {
                        setUsers(prev =>
                            prev.map(u =>
                                u.userId === updatedUser.userId ? updatedUser : u
                            )
                        );
                        setAlert({ type: 'success', message: 'User updated successfully!' });
                        setTimeout(() => setAlert(null), 3000);
                    }}
                />
            )}
        </div>
    );
};

// Simple Edit Modal Component
const UserEditModal = ({ user, isOpen, onClose, onUserUpdate }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        nim: user?.nim || '',
        phone: user?.phone || '',
        province: user?.province || '',
        city: user?.city || '',
        roleName: user?.roleName || 'USER'
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await api.put(`/users/${user.userId}`, formData);
            onUserUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop fade show" onClick={onClose}></div>
            <div className="modal fade show d-block" style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">
                                <i className="fas fa-user-edit me-2"></i>
                                Edit User: {user.name}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">NIM</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.nim}
                                                onChange={(e) => setFormData(prev => ({...prev, nim: e.target.value}))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Province</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.province}
                                                onChange={(e) => setFormData(prev => ({...prev, province: e.target.value}))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.city}
                                                onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label className="form-label">Role</label>
                                            <select
                                                className="form-select"
                                                value={formData.roleName}
                                                onChange={(e) => setFormData(prev => ({...prev, roleName: e.target.value}))}
                                            >
                                                <option value="USER">Regular User</option>
                                                <option value="ADMIN">Administrator</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-1"></i>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserManagement;