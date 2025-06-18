// LANGKAH 1: Perbaiki Navbar.jsx untuk dropdown admin yang berfungsi
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
    const dropdownRef = useRef(null);

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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAdminDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { path: '/journarls', label: 'Journals', icon: 'fas fa-book-open' },
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

                        {/* Admin Dropdown - PERBAIKAN */}
                        {user?.roleName === 'ADMIN' && (
                            <div
                                className="nav-dropdown"
                                ref={dropdownRef}
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
                            <div className="user-info dark">
                                <div className="user-avatar">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="user-name">{user?.name || 'User'}</span>
                            </div>

                            <button onClick={handleLogout} className="logout-btn">
                                <i className="fas fa-sign-out-alt"></i>
                                Logout
                            </button>
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
            </div>
        </nav>
    );
};

export default Navbar;