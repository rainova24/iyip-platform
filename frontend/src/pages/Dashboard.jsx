// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        journals: 0,
        events: 0,
        submissions: 0,
        communities: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch user statistics
            const [journalsRes, eventsRes, submissionsRes, communitiesRes] = await Promise.all([
                axios.get('/api/journals/count'),
                axios.get('/api/events/count'),
                axios.get('/api/submissions/count'),
                axios.get('/api/communities/count')
            ]);

            setStats({
                journals: journalsRes.data.count || 0,
                events: eventsRes.data.count || 0,
                submissions: submissionsRes.data.count || 0,
                communities: communitiesRes.data.count || 0
            });

            // Fetch recent activities
            const activitiesRes = await axios.get('/api/activities/recent');
            setRecentActivities(activitiesRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">
                        <span>🎓</span> IYIP Platform
                    </Link>
                    <nav>
                        <ul className="nav-menu">
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/journals">Journals</Link></li>
                            <li><Link to="/events">Events</Link></li>
                            <li><Link to="/submissions">Submissions</Link></li>
                            <li><Link to="/communities">Communities</Link></li>
                            <li>
                                <button onClick={handleLogout} className="nav-link-button">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="container">
                {/* Welcome Section */}
                <div className="panel" style={{
                    background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%)',
                    color: 'white'
                }}>
                    <h1 style={{ marginBottom: '0.5rem' }}>
                        Welcome back, {user?.name || 'User'}! 👋
                    </h1>
                    <p style={{ opacity: 0.9 }}>
                        Here's an overview of your academic activities
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="panel">
                    <h2 className="panel-header">Quick Actions</h2>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Link to="/journals/new" className="btn">
                            <span style={{ marginRight: '0.5rem' }}>📝</span>
                            Create Journal
                        </Link>
                        <Link to="/events" className="btn btn-secondary">
                            <span style={{ marginRight: '0.5rem' }}>📅</span>
                            Browse Events
                        </Link>
                        <Link to="/submissions/new" className="btn btn-secondary">
                            <span style={{ marginRight: '0.5rem' }}>📤</span>
                            New Submission
                        </Link>
                        <Link to="/communities" className="btn btn-secondary">
                            <span style={{ marginRight: '0.5rem' }}>👥</span>
                            Join Community
                        </Link>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <div className="stat-number">
                            {loading ? '...' : stats.journals}
                        </div>
                        <div className="stat-label">My Journals</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {loading ? '...' : stats.events}
                        </div>
                        <div className="stat-label">Registered Events</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {loading ? '...' : stats.submissions}
                        </div>
                        <div className="stat-label">Submissions</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">
                            {loading ? '...' : stats.communities}
                        </div>
                        <div className="stat-label">Communities</div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="panel">
                    <h2 className="panel-header">Recent Activities</h2>
                    {loading ? (
                        <p className="text-center">Loading activities...</p>
                    ) : recentActivities.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentActivities.map((activity, index) => (
                                    <tr key={index}>
                                        <td>{activity.description}</td>
                                        <td>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '15px',
                                                    background: 'var(--bg-light)',
                                                    color: 'var(--primary-orange)',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {activity.type}
                                                </span>
                                        </td>
                                        <td>{new Date(activity.createdAt).toLocaleDateString()}</td>
                                        <td>
                                                <span style={{
                                                    color: activity.status === 'completed' ? '#28a745' : '#ffc107'
                                                }}>
                                                    {activity.status}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center" style={{ color: 'var(--text-light)' }}>
                            No recent activities. Start by creating a journal or joining an event!
                        </p>
                    )}
                </div>

                {/* User Profile Summary */}
                <div className="panel">
                    <h2 className="panel-header">Profile Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Name</label>
                            <p style={{ fontWeight: '600' }}>{user?.name || 'Not set'}</p>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Email</label>
                            <p style={{ fontWeight: '600' }}>{user?.email || 'Not set'}</p>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>NIM</label>
                            <p style={{ fontWeight: '600' }}>{user?.nim || 'Not set'}</p>
                        </div>
                        <div>
                            <label style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Member Since</label>
                            <p style={{ fontWeight: '600' }}>
                                {user?.registeredAt ? new Date(user.registeredAt).toLocaleDateString() : 'Unknown'}
                            </p>
                        </div>
                    </div>
                    <Link to="/profile" className="btn btn-secondary mt-3">
                        Edit Profile
                    </Link>
                </div>
            </div>

            <footer className="footer">
                <p>&copy; 2024 IYIP Platform. All rights reserved.</p>
            </footer>
        </>
    );
};

export default Dashboard;