// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">
                        <span>🎓</span> IYIP Platform
                    </Link>
                    <nav>
                        <ul className="nav-menu">
                            {isAuthenticated ? (
                                <>
                                    <li><Link to="/dashboard">Dashboard</Link></li>
                                    <li><Link to="/journals">Journals</Link></li>
                                    <li><Link to="/events">Events</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="container">
                {/* Hero Section */}
                <div className="panel" style={{
                    background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%)',
                    color: 'white',
                    textAlign: 'center',
                    padding: '3rem 2rem'
                }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        Welcome to IYIP Platform
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
                        Comprehensive solution for managing academic journals, events, and submissions
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {!isAuthenticated && (
                            <>
                                <Link to="/login" className="btn" style={{
                                    background: 'white',
                                    color: 'var(--primary-orange)'
                                }}>
                                    Login Now
                                </Link>
                                <Link to="/register" className="btn" style={{
                                    background: 'transparent',
                                    border: '2px solid white',
                                    color: 'white'
                                }}>
                                    Create Account
                                </Link>
                            </>
                        )}
                        {isAuthenticated && (
                            <Link to="/dashboard" className="btn" style={{
                                background: 'white',
                                color: 'var(--primary-orange)'
                            }}>
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="dashboard-grid">
                    <div className="panel">
                        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                            📚 Journal Management
                        </h3>
                        <p>Create, edit, and publish your academic journals with ease. Share your research with the community.</p>
                    </div>

                    <div className="panel">
                        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                            📅 Event Organization
                        </h3>
                        <p>Organize and manage academic events, conferences, and workshops. Track registrations effortlessly.</p>
                    </div>

                    <div className="panel">
                        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                            📝 Submission Tracking
                        </h3>
                        <p>Submit and track your academic papers, materials, and research documents in one place.</p>
                    </div>

                    <div className="panel">
                        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                            👥 Community Hub
                        </h3>
                        <p>Connect with academic communities, join discussions, and collaborate with peers.</p>
                    </div>
                </div>

                {/* API Documentation */}
                <div className="panel">
                    <h2 className="panel-header">API Endpoints</h2>
                    <p className="mb-3">IYIP Platform provides a comprehensive REST API for developers:</p>

                    <div className="mb-4">
                        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                            🔐 Authentication Endpoints
                        </h3>
                        <div className="endpoint-box">POST /api/auth/login</div>
                        <div className="endpoint-box">POST /api/auth/register</div>
                        <div className="endpoint-box">GET /api/auth/verify</div>
                    </div>

                    <div className="mb-4">
                        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                            📖 Journal Endpoints
                        </h3>
                        <div className="endpoint-box">GET /api/journals</div>
                        <div className="endpoint-box">GET /api/journals/{'{id}'}</div>
                        <div className="endpoint-box">POST /api/journals</div>
                        <div className="endpoint-box">PUT /api/journals/{'{id}'}</div>
                        <div className="endpoint-box">DELETE /api/journals/{'{id}'}</div>
                    </div>

                    <div className="mb-4">
                        <h3 style={{ color: 'var(--primary-orange)', marginBottom: '1rem' }}>
                            🎯 Event Endpoints
                        </h3>
                        <div className="endpoint-box">GET /api/events</div>
                        <div className="endpoint-box">GET /api/events/{'{id}'}</div>
                        <div className="endpoint-box">POST /api/events</div>
                        <div className="endpoint-box">POST /api/events/{'{id}'}/register</div>
                    </div>

                    <p className="mt-3" style={{ color: 'var(--text-light)' }}>
                        💡 <strong>Note:</strong> Protected endpoints require a valid JWT token in the Authorization header.
                    </p>
                </div>

                {/* Statistics */}
                <div className="panel" style={{ textAlign: 'center' }}>
                    <h2 className="panel-header">Platform Statistics</h2>
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">1,200+</div>
                            <div className="stat-label">Journals Published</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Events Organized</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">25+</div>
                            <div className="stat-label">Active Communities</div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <p>&copy; 2024 IYIP Platform - Institut Teknologi Nasional Bandung</p>
                <p>
                    <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a>
                </p>
            </footer>
        </>
    );
};

export default Home;