// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAdminDropdown, setShowAdminDropdown] = useState(false);

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

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { path: '/journals', label: 'Journals', icon: 'fas fa-book-open' },
        { path: '/events', label: 'Events', icon: 'fas fa-calendar-alt' },
        { path: '/submissions', label: 'Submissions', icon: 'fas fa-paper-plane' },
        { path: '/communities', label: 'Communities', icon: 'fas fa-users' },
    ];

    const adminItems = [
        { path: '/admin/users', label: 'User Management', icon: 'fas fa-users-cog' },
        { path: '/admin/analytics', label: 'Analytics', icon: 'fas fa-chart-bar' },
        { path: '/admin/settings', label: 'System Settings', icon: 'fas fa-cogs' },
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
                                onMouseEnter={() => setShowAdminDropdown(true)}
                                onMouseLeave={() => setShowAdminDropdown(false)}
                            >
                                <button className="nav-link dropdown-toggle">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Admin</span>
                                    <i className="fas fa-chevron-down ms-1"></i>
                                </button>

                                {showAdminDropdown && (
                                    <div className="dropdown-menu">
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

                            <div className="user-dropdown">
                                <Link to="/profile" className="dropdown-item">
                                    <i className="fas fa-user me-2"></i>
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className="dropdown-item logout-btn">
                                    <i className="fas fa-sign-out-alt me-2"></i>
                                    Logout
                                </button>
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
                {isAuthenticated && (
                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                )}
            </div>

            {/* Mobile Navigation */}
            {isAuthenticated && isMenuOpen && (
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

                        {/* Admin Section for Mobile */}
                        {user?.roleName === 'ADMIN' && (
                            <div className="mobile-admin-section">
                                <div className="mobile-section-title">
                                    <i className="fas fa-shield-alt me-2"></i>
                                    Admin Tools
                                </div>
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

                        <div className="mobile-nav-footer">
                            <Link
                                to="/profile"
                                className="mobile-nav-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <i className="fas fa-user"></i>
                                <span>Profile</span>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="mobile-nav-link logout"
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