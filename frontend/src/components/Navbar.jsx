// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-wrapper">
                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">I</div>
                    <span className="brand-text">IYIP Platform</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="nav-menu d-none d-md-flex">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Home
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link
                                to="/dashboard"
                                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/events"
                                className={`nav-link ${isActive('/events') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Events
                            </Link>
                            <Link
                                to="/journals"
                                className={`nav-link ${isActive('/journals') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Journals
                            </Link>
                            <Link
                                to="/communities"
                                className={`nav-link ${isActive('/communities') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Communities
                            </Link>
                            <Link
                                to="/submissions"
                                className={`nav-link ${isActive('/submissions') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Submissions
                            </Link>
                        </>
                    )}
                </div>

                {/* Auth Section - Always on the right */}
                <div className="nav-auth">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <Link to="/profile" className="user-info dark" style={{ textDecoration: 'none' }}>
                                <div className="user-avatar">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <span className="user-name d-none d-sm-inline">
                                    {user?.name || 'Admin User'}
                                </span>
                            </Link>
                            <button
                                className="btn btn-outline btn-sm logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons d-none d-md-flex">
                            <Link to="/login" className="btn btn-outline btn-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary btn-sm">
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle d-md-none"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle navigation"
                >
                    <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></div>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu d-md-none">
                    <Link
                        to="/"
                        className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                        onClick={closeMobileMenu}
                    >
                        Home
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/events"
                                className={`mobile-nav-link ${isActive('/events') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Events
                            </Link>
                            <Link
                                to="/journals"
                                className={`mobile-nav-link ${isActive('/journals') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Journals
                            </Link>
                            <Link
                                to="/communities"
                                className={`mobile-nav-link ${isActive('/communities') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Communities
                            </Link>
                            <Link
                                to="/submissions"
                                className={`mobile-nav-link ${isActive('/submissions') ? 'active' : ''}`}
                                onClick={closeMobileMenu}
                            >
                                Submissions
                            </Link>

                            <div className="mobile-auth-buttons">
                                <Link
                                    to="/profile"
                                    className="mobile-user-info"
                                    onClick={closeMobileMenu}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <span>{user?.name || 'Admin User'}</span>
                                </Link>
                                <button
                                    className="btn btn-outline w-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="mobile-auth-buttons">
                            <Link
                                to="/login"
                                className="btn btn-outline w-100"
                                onClick={closeMobileMenu}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary w-100"
                                onClick={closeMobileMenu}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;