// frontend/src/pages/Dashboard.jsx - ROLE-BASED VERSION
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        myJournals: 0,
        registeredEvents: 0,
        totalCommunities: 0,
        submissions: 0, // Will be either "my submissions" or "pending submissions"
    });

    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            console.log('🔄 Loading role-based dashboard data...');
            console.log('👤 Current user role:', user?.roleName);

            const isAdmin = user?.roleName === 'ADMIN';

            // API calls based on user role
            const apiCalls = [
                // Get journals - coba my-journals dulu, kalau gagal ambil semua
                api.get('/journals/my-journals').catch(() =>
                    api.get('/journals').catch(() => ({ data: [] }))
                ),

                // Get communities
                api.get('/communities').catch(() => ({ data: [] })),

                // Get submissions - BERBEDA untuk admin vs user
                isAdmin
                    ? api.get('/submissions').catch(() => ({ data: [] })) // Admin: get all submissions
                    : api.get('/submissions/my-submissions').catch(() =>
                        api.get('/submissions').catch(() => ({ data: [] })) // User: get my submissions
                    ),

                // Get events
                api.get('/events').catch(() => ({ data: [] }))
            ];

            const [journalsRes, communitiesRes, submissionsRes, eventsRes] = await Promise.allSettled(apiCalls);

            let myJournals = 0;
            let totalCommunities = 0;
            let submissionsCount = 0;
            let registeredEvents = 0;

            // Process Journals
            if (journalsRes.status === 'fulfilled' && journalsRes.value?.data) {
                let journalsData = journalsRes.value.data;

                // Handle different response formats
                if (Array.isArray(journalsData)) {
                    // Filter by current user if we got all journals
                    const userJournals = journalsData.filter(journal =>
                        journal.userId === user?.userId ||
                        journal.user?.userId === user?.userId ||
                        journal.user?.email === user?.email
                    );
                    myJournals = userJournals.length;
                } else if (journalsData.data && Array.isArray(journalsData.data)) {
                    const userJournals = journalsData.data.filter(journal =>
                        journal.userId === user?.userId ||
                        journal.user?.userId === user?.userId ||
                        journal.user?.email === user?.email
                    );
                    myJournals = userJournals.length;
                }

                console.log('📄 Journals processed:', myJournals);
            }

            // Process Communities
            if (communitiesRes.status === 'fulfilled' && communitiesRes.value?.data) {
                let communitiesData = communitiesRes.value.data;

                if (Array.isArray(communitiesData)) {
                    totalCommunities = communitiesData.length;
                } else if (communitiesData.data && Array.isArray(communitiesData.data)) {
                    totalCommunities = communitiesData.data.length;
                }

                console.log('👥 Communities processed:', totalCommunities);
            }

            // Process Submissions - BERBEDA untuk Admin vs User
            if (submissionsRes.status === 'fulfilled' && submissionsRes.value?.data) {
                let submissionsData = submissionsRes.value.data;
                let allSubmissions = [];

                if (Array.isArray(submissionsData)) {
                    allSubmissions = submissionsData;
                } else if (submissionsData.data && Array.isArray(submissionsData.data)) {
                    allSubmissions = submissionsData.data;
                }

                if (isAdmin) {
                    // ADMIN: Count PENDING submissions
                    const pendingSubmissions = allSubmissions.filter(submission =>
                        submission.status === 'PENDING'
                    );
                    submissionsCount = pendingSubmissions.length;
                    console.log('🔧 Admin - Pending submissions:', submissionsCount);
                } else {
                    // USER: Count MY submissions
                    const userSubmissions = allSubmissions.filter(submission =>
                        submission.userId === user?.userId ||
                        submission.user?.userId === user?.userId ||
                        submission.user?.email === user?.email
                    );
                    submissionsCount = userSubmissions.length;
                    console.log('👤 User - My submissions:', submissionsCount);
                }
            }

            // Process Events
            if (eventsRes.status === 'fulfilled' && eventsRes.value?.data) {
                let eventsData = eventsRes.value.data;

                if (Array.isArray(eventsData)) {
                    registeredEvents = eventsData.length;
                } else if (eventsData.data && Array.isArray(eventsData.data)) {
                    registeredEvents = eventsData.data.length;
                }

                console.log('🎉 Events processed:', registeredEvents);
            }

            const finalStats = {
                myJournals,
                registeredEvents,
                totalCommunities,
                submissions: submissionsCount
            };

            console.log('📊 Final Role-Based Dashboard Stats:', finalStats);
            setStats(finalStats);

        } catch (error) {
            console.error('❌ Error loading dashboard data:', error);

            setStats({
                myJournals: 0,
                registeredEvents: 0,
                totalCommunities: 0,
                submissions: 0
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper function to refresh data
    const refreshData = () => {
        console.log('🔄 Refreshing dashboard data...');
        loadDashboardData();
    };

    // Get submission card info based on user role
    const getSubmissionCardInfo = () => {
        const isAdmin = user?.roleName === 'ADMIN';

        if (isAdmin) {
            return {
                label: 'Pending Submissions',
                description: 'Submissions waiting for your review',
                color: '#f5576c' // Red color for urgency
            };
        } else {
            return {
                label: 'My Submissions',
                description: 'Your submitted materials and requests',
                color: '#43e97b' // Green color
            };
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-content">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const submissionInfo = getSubmissionCardInfo();

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Welcome Header */}
                <div className="welcome-header">
                    <div className="welcome-content">
                        <div className="user-avatar-large">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div className="welcome-text">
                            <h1>Welcome, {user?.name || 'Admin A'}!</h1>
                            <div className="user-info dark">
                                <span>
                                    <i className="fas fa-envelope"></i>
                                    {user?.email || 'admina@iyip.com'}
                                </span>
                                <span>
                                    <i className="fas fa-user-tag"></i>
                                    {user?.roleName || 'ADMIN'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overview Statistics */}
                <div className="stats-section">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 className="section-title">Overview Statistics</h2>
                        <button
                            className="btn btn-sm"
                            onClick={refreshData}
                            style={{
                                padding: '0.5rem 1rem',
                                border: '2px solid #ff6b35',
                                background: 'transparent',
                                color: '#ff6b35',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#ff6b35';
                                e.target.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#ff6b35';
                            }}
                        >
                            <i className="fas fa-sync-alt"></i> Refresh Data
                        </button>
                    </div>

                    <div className="stats-grid">
                        {/* My Journals */}
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon journals">
                                    <i className="fas fa-book-open"></i>
                                </div>
                                <div className="stat-number" style={{
                                    color: '#667eea',
                                    fontSize: '3rem',
                                    fontWeight: '900'
                                }}>
                                    {stats.myJournals}
                                </div>
                            </div>
                            <div className="stat-label">My Journals</div>
                            <div className="stat-description">Published research papers and articles</div>
                        </div>

                        {/* Available Events */}
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon events">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <div className="stat-number" style={{
                                    color: '#f5576c',
                                    fontSize: '3rem',
                                    fontWeight: '900'
                                }}>
                                    {stats.registeredEvents}
                                </div>
                            </div>
                            <div className="stat-label">Available Events</div>
                            <div className="stat-description">Events available for registration</div>
                        </div>

                        {/* Communities */}
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon communities">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="stat-number" style={{
                                    color: '#00f2fe',
                                    fontSize: '3rem',
                                    fontWeight: '900'
                                }}>
                                    {stats.totalCommunities}
                                </div>
                            </div>
                            <div className="stat-label">Communities</div>
                            <div className="stat-description">Active research communities</div>
                        </div>

                        {/* Submissions - Role-based */}
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon submissions">
                                    <i className="fas fa-upload"></i>
                                </div>
                                <div className="stat-number" style={{
                                    color: submissionInfo.color,
                                    fontSize: '3rem',
                                    fontWeight: '900'
                                }}>
                                    {stats.submissions}
                                </div>
                            </div>
                            <div className="stat-label">{submissionInfo.label}</div>
                            <div className="stat-description">{submissionInfo.description}</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="actions-grid">
                        <div className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-plus"></i>
                            </div>
                            <h3>Create Journal</h3>
                            <p>Start writing a new research journal or article</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/journals')}
                            >
                                <i className="fas fa-edit"></i> New Journal
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-calendar-plus"></i>
                            </div>
                            <h3>View Events</h3>
                            <p>Browse and register for upcoming events</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/events')}
                            >
                                <i className="fas fa-calendar-check"></i> View Events
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>Join Communities</h3>
                            <p>Connect with like-minded researchers</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/communities')}
                            >
                                <i className="fas fa-user-plus"></i> Explore
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-upload"></i>
                            </div>
                            <h3>
                                {user?.roleName === 'ADMIN' ? 'Review Submissions' : 'New Submission'}
                            </h3>
                            <p>
                                {user?.roleName === 'ADMIN'
                                    ? 'Review and approve pending submissions'
                                    : 'Submit materials or facility requests'
                                }
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/submissions')}
                            >
                                <i className={`fas fa-${user?.roleName === 'ADMIN' ? 'clipboard-check' : 'paper-plane'}`}></i>
                                {user?.roleName === 'ADMIN' ? ' Review' : ' Submit'}
                            </button>
                        </div>

                        {user?.roleName === 'ADMIN' && (
                            <div className="action-card">
                                <div className="action-icon">
                                    <i className="fas fa-users-cog"></i>
                                </div>
                                <h3>Manage Users</h3>
                                <p>Admin panel for user management</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/admin/users')}
                                >
                                    <i className="fas fa-cog"></i> Admin Panel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Debug Info - Only in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        border: '1px solid #ddd'
                    }}>
                        <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>🐛 Debug Info:</h4>
                        <p><strong>User ID:</strong> {user?.userId || 'Not available'}</p>
                        <p><strong>User Email:</strong> {user?.email || 'Not available'}</p>
                        <p><strong>User Role:</strong> {user?.roleName || 'Not available'}</p>
                        <p><strong>Is Admin:</strong> {user?.roleName === 'ADMIN' ? 'Yes' : 'No'}</p>
                        <p><strong>Stats:</strong> {JSON.stringify(stats, null, 2)}</p>
                        <p><strong>Submission Info:</strong> {JSON.stringify(submissionInfo, null, 2)}</p>
                        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;