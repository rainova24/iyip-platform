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
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04)', background: 'rgba(255,255,255,0.97)', borderBottom: '1.5px solid #f5f5f5', zIndex: 1000 }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
                {/* Brand */}
                <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #ffb88c 0%, #de6262 100%)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: 22,
                        boxShadow: '0 2px 8px rgba(222,98,98,0.08)'
                    }}>
                        I
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 22, color: '#de6262', letterSpacing: 1 }}>IYIP Platform</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-nav d-none d-md-flex" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Link 
                        to="/" 
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <i className="fas fa-home"></i> Home
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-chart-line"></i> Dashboard</Link>
                            <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-calendar-alt"></i> Events</Link>
                            <Link to="/journals" className={`nav-link ${isActive('/journals') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-book"></i> Journals</Link>
                            <Link to="/communities" className={`nav-link ${isActive('/communities') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-users"></i> Communities</Link>
                            <Link to="/submissions" className={`nav-link ${isActive('/submissions') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-upload"></i> Submissions</Link>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-sign-in-alt"></i> Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-user-plus"></i> Register</Link>
                        </>
                    )}
                    {isAuthenticated && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff6f0', borderRadius: 24, padding: '4px 14px 4px 6px', boxShadow: '0 1px 4px rgba(222,98,98,0.06)' }}>
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    background: 'linear-gradient(135deg, #ffb88c 0%, #de6262 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 18
                                }}>{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                                <span style={{ fontWeight: 600, color: '#de6262', fontSize: 15 }}>{user?.name || 'User'}</span>
                            </div>
                            <button onClick={handleLogout} className="btn btn-danger" style={{ padding: '6px 18px', borderRadius: 8, fontWeight: 600, fontSize: 15, boxShadow: '0 1px 4px rgba(222,98,98,0.08)' }}>
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-btn d-md-none"
                    onClick={toggleMobileMenu}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.7rem',
                        color: '#de6262',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        transition: '0.2s',
                        marginLeft: 10
                    }}
                >
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div 
                    className="mobile-nav"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(222,98,98,0.08)',
                        borderRadius: '0 0 20px 20px',
                        padding: '2rem 1.5rem 1.5rem',
                        animation: 'slideDown 0.3s ease',
                        zIndex: 1001
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-home"></i> Home</Link>
                        {isAuthenticated && <>
                            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-chart-line"></i> Dashboard</Link>
                            <Link to="/events" className={`nav-link ${isActive('/events') ? 'active' : ''}`} onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-calendar-alt"></i> Events</Link>
                            <Link to="/journals" className={`nav-link ${isActive('/journals') ? 'active' : ''}`} onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-book"></i> Journals</Link>
                            <Link to="/communities" className={`nav-link ${isActive('/communities') ? 'active' : ''}`} onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-users"></i> Communities</Link>
                            <Link to="/submissions" className={`nav-link ${isActive('/submissions') ? 'active' : ''}`} onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-upload"></i> Submissions</Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff6f0', borderRadius: 24, padding: '6px 16px', marginTop: 10 }}>
                                <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ffb88c 0%, #de6262 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                                <span style={{ fontWeight: 600, color: '#de6262', fontSize: 15 }}>{user?.name || 'User'}</span>
                            </div>
                            <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="btn btn-danger" style={{ padding: '7px 0', borderRadius: 8, fontWeight: 600, fontSize: 15, marginTop: 8 }}><i className="fas fa-sign-out-alt"></i> Logout</button>
                        </>}
                        {!isAuthenticated && <>
                            <Link to="/login" className="btn btn-outline" onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-sign-in-alt"></i> Login</Link>
                            <Link to="/register" className="btn btn-primary" onClick={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><i className="fas fa-user-plus"></i> Register</Link>
                        </>}
                    </div>
                </div>
            )}
            <style jsx>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;