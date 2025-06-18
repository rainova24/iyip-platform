// frontend/src/pages/UserManagement.jsx - UPDATED WITH WORKING BUTTONS
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const UserManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
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
            console.log('👥 Users loaded:', usersData);
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

    // Navigate to edit user page
    const handleEditUser = (userId) => {
        navigate(`/admin/users/edit/${userId}`);
    };

    // Navigate to view user page
    const handleViewUser = (userId) => {
        // For now, just log the action - you can implement view user page later
        console.log('View user:', userId);
        setAlert({ type: 'info', message: 'View user functionality coming soon!' });
        setTimeout(() => setAlert(null), 3000);
    };

    // Navigate to add user page
    const handleAddUser = () => {
        navigate('/admin/users/add');
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
            <div style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #fff5f2 0%, #fff 50%, #fff5f2 100%)',
                padding: '2rem'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '400px'
                }}>
                    <i className="fas fa-exclamation-triangle" style={{
                        fontSize: '3rem',
                        color: '#f5576c',
                        marginBottom: '1rem'
                    }}></i>
                    <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>Access Denied</h3>
                    <p style={{ color: '#666' }}>Admin privileges required to access this page.</p>
                </div>
            </div>
        );
    }

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
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading users...</p>
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
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 2rem'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                    borderRadius: '16px',
                    padding: '3rem 2rem',
                    color: 'white',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(255, 107, 53, 0.3)'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            margin: '0 0 0.5rem 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <i className="fas fa-users-cog" style={{ fontSize: '2rem' }}></i>
                            User Management
                        </h1>
                        <p style={{
                            fontSize: '1.1rem',
                            margin: '0',
                            opacity: 0.9
                        }}>
                            Manage all users in the system
                        </p>
                    </div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <button
                            onClick={handleAddUser}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            }}
                        >
                            <i className="fas fa-user-plus"></i>
                            Add New User
                        </button>
                    </div>

                    {/* Background decoration */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        right: '-20%',
                        width: '300px',
                        height: '300px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }}></div>
                </div>

                {/* Statistics */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '2rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            color: '#ff6b35',
                            marginBottom: '0.5rem'
                        }}>
                            {users.length}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Total Users
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            color: '#f5576c',
                            marginBottom: '0.5rem'
                        }}>
                            {users.filter(u => u.roleName === 'ADMIN').length}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Administrators
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            color: '#43e97b',
                            marginBottom: '0.5rem'
                        }}>
                            {users.filter(u => u.roleName === 'USER').length}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Regular Users
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '900',
                            color: '#00f2fe',
                            marginBottom: '0.5rem'
                        }}>
                            {getNewUsersCount()}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: '#666',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            New (30 days)
                        </div>
                    </div>
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
                        background: alert.type === 'error' ? '#f8d7da' :
                            alert.type === 'info' ? '#d1ecf1' : '#d4edda',
                        color: alert.type === 'error' ? '#721c24' :
                            alert.type === 'info' ? '#0c5460' : '#155724',
                        border: `1px solid ${alert.type === 'error' ? '#f5c6cb' :
                            alert.type === 'info' ? '#bee5eb' : '#c3e6cb'}`
                    }}>
                        <i className={`fas fa-${alert.type === 'error' ? 'exclamation-circle' :
                            alert.type === 'info' ? 'info-circle' : 'check-circle'}`}></i>
                        {alert.message}
                    </div>
                )}

                {/* Filters */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem 2rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '2rem',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['All Users', 'Administrators', 'Regular Users'].map(filter => (
                            <button
                                key={filter}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: activeFilter === filter ? '#ff6b35' : '#f8f9fa',
                                    color: activeFilter === filter ? 'white' : '#666',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.9rem'
                                }}
                                onClick={() => setActiveFilter(filter)}
                                onMouseOver={(e) => {
                                    if (activeFilter !== filter) {
                                        e.target.style.background = '#e9ecef';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (activeFilter !== filter) {
                                        e.target.style.background = '#f8f9fa';
                                    }
                                }}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '250px' }}>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '2px solid #e9ecef',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                flex: 1,
                                transition: 'border-color 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                        <i className="fas fa-search" style={{ color: '#999' }}></i>
                    </div>
                </div>

                {/* Users Grid */}
                {filteredUsers.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                    }}>
                        <i className="fas fa-users" style={{
                            fontSize: '4rem',
                            color: '#ddd',
                            marginBottom: '1rem'
                        }}></i>
                        <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>No users found</h3>
                        <p style={{ color: '#666' }}>Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        {filteredUsers.map(userItem => (
                            <div key={userItem.userId} style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '2rem',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease',
                                border: '1px solid #f0f0f0',
                                cursor: 'default'
                            }}
                                 onMouseOver={(e) => {
                                     e.currentTarget.style.transform = 'translateY(-4px)';
                                     e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                                 }}
                                 onMouseOut={(e) => {
                                     e.currentTarget.style.transform = 'translateY(0)';
                                     e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
                                 }}
                            >
                                {/* User Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.5rem',
                                        fontWeight: '700',
                                        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                                    }}>
                                        {userItem.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            margin: '0 0 0.25rem 0',
                                            fontSize: '1.25rem',
                                            fontWeight: '600',
                                            color: '#333'
                                        }}>
                                            {userItem.name || 'Unknown User'}
                                        </h3>
                                        <p style={{
                                            margin: '0 0 0.5rem 0',
                                            color: '#666',
                                            fontSize: '0.9rem'
                                        }}>
                                            {userItem.email}
                                        </p>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            background: userItem.roleName === 'ADMIN' ? '#dc3545' : '#28a745',
                                            color: 'white'
                                        }}>
                                            {userItem.roleName || 'USER'}
                                        </span>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#888',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '0.25rem'
                                        }}>
                                            NIM
                                        </div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            color: '#333',
                                            fontWeight: '500'
                                        }}>
                                            {userItem.nim || 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#888',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '0.25rem'
                                        }}>
                                            Phone
                                        </div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            color: '#333',
                                            fontWeight: '500'
                                        }}>
                                            {userItem.phone || 'N/A'}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#888',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '0.25rem'
                                        }}>
                                            Location
                                        </div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            color: '#333',
                                            fontWeight: '500'
                                        }}>
                                            {userItem.city && userItem.province
                                                ? `${userItem.city}, ${userItem.province}`
                                                : 'N/A'
                                            }
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            color: '#888',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            marginBottom: '0.25rem'
                                        }}>
                                            Joined
                                        </div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            color: '#333',
                                            fontWeight: '500'
                                        }}>
                                            {formatDate(userItem.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    justifyContent: 'flex-end'
                                }}>
                                    <button
                                        onClick={() => handleViewUser(userItem.userId)}
                                        style={{
                                            padding: '0.375rem 0.75rem',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: '#6c757d',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#545b62'}
                                        onMouseOut={(e) => e.target.style.background = '#6c757d'}
                                    >
                                        <i className="fas fa-eye"></i>
                                        View
                                    </button>

                                    <button
                                        onClick={() => handleEditUser(userItem.userId)}
                                        style={{
                                            padding: '0.375rem 0.75rem',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.8rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            background: '#ff6b35',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#e55a2b'}
                                        onMouseOut={(e) => e.target.style.background = '#ff6b35'}
                                    >
                                        <i className="fas fa-edit"></i>
                                        Edit
                                    </button>

                                    {userItem.userId !== user?.userId && (
                                        <button
                                            onClick={() => handleDeleteUser(userItem.userId, userItem.name)}
                                            style={{
                                                padding: '0.375rem 0.75rem',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                background: '#dc3545',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = '#c82333'}
                                            onMouseOut={(e) => e.target.style.background = '#dc3545'}
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

            {/* Add CSS Animation */}
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default UserManagement;