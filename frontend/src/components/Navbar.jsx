// File: frontend/src/components/Navbar.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAdminDropdown, setShowAdminDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const adminDropdownRef = useRef(null);
    const userDropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
                setShowAdminDropdown(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { path: '/journals', label: 'Journals', icon: 'fas fa-book-open' },
        { path: '/events', label: 'Events', icon: 'fas fa-calendar-alt' },
        { path: '/communities', label: 'Communities', icon: 'fas fa-users' },
        { path: '/submissions', label: 'Submissions', icon: 'fas fa-paper-plane' },
    ];

    const adminItems = [
        { path: '/admin/users', label: 'User Management', icon: 'fas fa-users-cog' }
    ];

    return (
        <nav className="navbar">
            <div className="container">
                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">I</div>
                    <span className="brand-text">IYIP Platform</span>
                </Link>

                {/* Desktop Navigation */}
                {isAuthenticated && (
                    <div className="nav-menu">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {/* Admin Dropdown */}
                        {user?.roleName === 'ADMIN' && (
                            <div
                                className="nav-dropdown"
                                ref={adminDropdownRef}
                            >
                                <button
                                    className="nav-link dropdown-toggle"
                                    onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                                    style={{
                                        background: showAdminDropdown ? 'rgba(255, 107, 53, 0.1)' : 'transparent',
                                        color: showAdminDropdown ? '#FF6B35' : 'inherit'
                                    }}
                                >
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Admin</span>
                                    <i className={`fas fa-chevron-${showAdminDropdown ? 'up' : 'down'} ms-1`}></i>
                                </button>

                                {showAdminDropdown && (
                                    <div className="dropdown-menu" style={{ display: 'block' }}>
                                        {adminItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                className={`dropdown-item ${isActive(item.path) ? 'active' : ''}`}
                                                onClick={() => setShowAdminDropdown(false)}
                                            >
                                                <i className={item.icon}></i>
                                                <span>{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* User Menu / Auth Buttons */}
                <div className="nav-auth">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            {/* User Info with Dropdown */}
                            <div className="nav-dropdown" ref={userDropdownRef}>
                                <button
                                    className="user-info dark dropdown-toggle"
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    style={{
                                        background: showUserDropdown
                                            ? 'linear-gradient(135deg, var(--dark-orange), var(--primary-orange))'
                                            : 'linear-gradient(135deg, var(--primary-orange), var(--secondary-orange))',
                                        border: 'none',
                                        borderRadius: '25px',
                                        padding: '0.5rem 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div className="user-avatar" style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '700',
                                        fontSize: '14px'
                                    }}>
                                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="user-name" style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '14px'
                                    }}>
                                        {user?.name || 'User'}
                                    </span>
                                    <i className={`fas fa-chevron-${showUserDropdown ? 'up' : 'down'}`}
                                       style={{ color: 'white', fontSize: '12px' }}></i>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserDropdown && (
                                    <div className="dropdown-menu" style={{ display: 'block' }}>
                                        <Link
                                            to="/profile"
                                            className={`dropdown-item ${isActive('/profile') ? 'active' : ''}`}
                                            onClick={() => setShowUserDropdown(false)}
                                        >
                                            <i className="fas fa-user-edit"></i>
                                            <span>Edit Profile</span>
                                        </Link>
                                        <button
                                            className="dropdown-item"
                                            onClick={() => {
                                                setShowUserDropdown(false);
                                                handleLogout();
                                            }}
                                            style={{
                                                color: '#dc3545',
                                                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                                                marginTop: '0.5rem',
                                                paddingTop: '0.75rem'
                                            }}
                                        >
                                            <i className="fas fa-sign-out-alt"></i>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-outline-primary">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={toggleMenu}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: '#FF6B35',
                        cursor: 'pointer'
                    }}
                >
                    <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="mobile-nav">
                    <div className="mobile-user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span>{user?.name || 'User'}</span>
                        <span className="user-role">{user?.roleName || 'USER'}</span>
                    </div>

                    <div className="mobile-nav-items">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </Link>
                        ))}

                        {/* Mobile Admin Section */}
                        {user?.roleName === 'ADMIN' && (
                            <div className="mobile-admin-section">
                                <div className="mobile-section-title">Admin Functions</div>
                                {adminItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`mobile-nav-link admin-link ${isActive(item.path) ? 'active' : ''}`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <i className={item.icon}></i>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Mobile Profile & Logout */}
                        <div className="mobile-nav-footer">
                            <Link
                                to="/profile"
                                className={`mobile-nav-link ${isActive('/profile') ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <i className="fas fa-user-edit"></i>
                                <span>Edit Profile</span>
                            </Link>
                            <button
                                className="mobile-nav-link logout"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;