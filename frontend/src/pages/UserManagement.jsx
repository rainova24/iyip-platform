// frontend/src/pages/UserManagement.jsx - IMPROVED VERSION
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Users');

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, activeFilter]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            const usersData = response.data || [];
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading users:', error);
            setAlert({ type: 'error', message: 'Failed to load users' });
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        // Filter by role
        if (activeFilter === 'Administrators') {
            filtered = filtered.filter(u => u.roleName === 'ADMIN');
        } else if (activeFilter === 'Regular Users') {
            filtered = filtered.filter(u => u.roleName === 'USER');
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(u =>
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.nim?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
            try {
                await api.delete(`/users/${userId}`);
                setAlert({ type: 'success', message: `User "${userName}" deleted successfully` });
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setAlert({ type: 'error', message: 'Failed to delete user' });
            }
            setTimeout(() => setAlert(null), 3000);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getNewUsersCount = () => {
        const thirtyDaysAgo = new Date(Date.now() - 30*24*60*60*1000);
        return users.filter(u => u.createdAt && new Date(u.createdAt) > thirtyDaysAgo).length;
    };

    if (user?.roleName !== 'ADMIN') {
        return (
            <div className="user-management-page">
                <div className="user-management-container">
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-triangle"></i>
                        Access denied. Admin privileges required.
                    </div>
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
                        <button
                            className="btn btn-primary"
                            onClick={() => window.location.href = '/register'}
                        >
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
                        <span className="stat-number">{getNewUsersCount()}</span>
                        <span className="stat-label">New (30 days)</span>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type === 'error' ? 'danger' : 'success'}`}>
                        <i className={`fas fa-${alert.type === 'error' ? 'exclamation-circle' : 'check-circle'}`}></i>
                        {alert.message}
                    </div>
                )}

                {/* Filters */}
                <div className="user-management-filters">
                    <div className="filter-tabs">
                        {['All Users', 'Administrators', 'Regular Users'].map(filter => (
                            <button
                                key={filter}
                                className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search" style={{ color: '#999' }}></i>
                    </div>
                </div>

                {/* Users Grid */}
                {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-users"></i>
                        <h3>No users found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="users-grid">
                        {filteredUsers.map(userItem => (
                            <div key={userItem.userId} className="user-card">
                                <div className="user-card-header">
                                    <div className="user-avatar">
                                        {userItem.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="user-info">
                                        <h3>{userItem.name || 'Unknown User'}</h3>
                                        <p>{userItem.email}</p>
                                        <span className={`user-role role-${userItem.roleName?.toLowerCase() || 'user'}`}>
                                            {userItem.roleName || 'USER'}
                                        </span>
                                    </div>
                                </div>

                                <div className="user-card-body">
                                    <div className="user-details">
                                        <div className="detail-item">
                                            <span className="detail-label">NIM</span>
                                            <span className="detail-value">{userItem.nim || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Phone</span>
                                            <span className="detail-value">{userItem.phone || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Location</span>
                                            <span className="detail-value">
                                                {userItem.city && userItem.province
                                                    ? `${userItem.city}, ${userItem.province}`
                                                    : 'N/A'
                                                }
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Joined</span>
                                            <span className="detail-value">{formatDate(userItem.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="user-card-actions">
                                    <button className="btn btn-secondary btn-sm">
                                        <i className="fas fa-eye"></i>
                                        View
                                    </button>
                                    <button className="btn btn-primary btn-sm">
                                        <i className="fas fa-edit"></i>
                                        Edit
                                    </button>
                                    {userItem.userId !== user?.userId && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteUser(userItem.userId, userItem.name)}
                                        >
                                            <i className="fas fa-trash"></i>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Info */}
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#666',
                    fontSize: '0.9rem'
                }}>
                    <p>Showing {filteredUsers.length} of {users.length} users</p>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;