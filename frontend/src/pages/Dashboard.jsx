// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        myJournals: 0,
        myEvents: 0,
        myCommunities: 0,
        mySubmissions: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch user statistics
            const [journalsRes, eventsRes, submissionsRes, communitiesRes] = await Promise.all([
                axios.get('/api/journals/count'),
                axios.get('/api/events/count'),
                axios.get('/api/submissions/count'),
                axios.get('/api/communities/count')
            ]);

            setStats({
                myJournals: journalsRes.data.count || 0,
                myEvents: eventsRes.data.count || 0,
                mySubmissions: submissionsRes.data.count || 0,
                myCommunities: communitiesRes.data.count || 0
            });

            // Fetch recent activities
            const activitiesRes = await axios.get('/api/activities/recent');
            setRecentActivity(activitiesRes.data.map(activity => ({
                id: activity.id,
                type: activity.type,
                title: activity.description,
                time: new Date(activity.createdAt).toLocaleDateString(),
                icon: getActivityIcon(activity.type),
                color: getActivityColor(activity.type)
            })));

            // Fetch upcoming events
            const upcomingEventsRes = await axios.get('/api/events/upcoming');
            setUpcomingEvents(upcomingEventsRes.data.map(event => ({
                id: event.id,
                title: event.title,
                date: event.date,
                time: event.time,
                location: event.location,
                status: event.status
            })));

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'journal': return 'fa-book';
            case 'event': return 'fa-calendar-alt';
            case 'community': return 'fa-users';
            case 'submission': return 'fa-upload';
            default: return 'fa-circle';
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'journal': return 'var(--primary-orange)';
            case 'event': return 'var(--info)';
            case 'community': return 'var(--success)';
            case 'submission': return 'var(--warning)';
            default: return 'var(--text-light)';
        }
    };

    const quickActions = [
        {
            title: 'Create Journal',
            description: 'Start writing your new academic journal',
            icon: 'fa-plus',
            link: '/journals',
            color: 'var(--primary-orange)',
            gradient: 'linear-gradient(135deg, var(--primary-orange), var(--secondary-orange))'
        },
        {
            title: 'Browse Events',
            description: 'Discover upcoming academic events',
            icon: 'fa-search',
            link: '/events',
            color: 'var(--info)',
            gradient: 'linear-gradient(135deg, var(--info), #5DADE2)'
        },
        {
            title: 'Join Community',
            description: 'Connect with like-minded students',
            icon: 'fa-user-plus',
            link: '/communities',
            color: 'var(--success)',
            gradient: 'linear-gradient(135deg, var(--success), #58D68D)'
        },
        {
            title: 'Submit Request',
            description: 'Submit material or facility requests',
            icon: 'fa-paper-plane',
            link: '/submissions',
            color: 'var(--warning)',
            gradient: 'linear-gradient(135deg, var(--warning), #F7DC6F)'
        }
    ];

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <div className="spinner"></div>
                <p className="text-secondary">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* No sidebar, only main content */}
            <div className="main-content w-100">
                {/* Welcome Header */}
                <div className="mb-4 p-4 bg-primary text-white rounded fade-in" style={{ boxShadow: 'var(--shadow-md)' }}>
                    <div className="d-flex align-items-center gap-3">
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            fontWeight: 700
                        }}>{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                        <div>
                            <h1 className="mb-1" style={{ color: 'var(--white)' }}>Welcome, {user?.name || 'User'}!</h1>
                            <div className="d-flex gap-3" style={{ flexWrap: 'wrap' }}>
                                <span className="text-white"><i className="fas fa-envelope"></i> {user?.email}</span>
                                <span className="text-white"><i className="fas fa-user-tag"></i> {user?.role || 'Student'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid mb-4">
                    <div className="stat-card">
                        <div className="stat-number">{stats.myJournals}</div>
                        <div className="stat-label"><i className="fas fa-book"></i> My Journals</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.myEvents}</div>
                        <div className="stat-label"><i className="fas fa-calendar-alt"></i> Registered Events</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.myCommunities}</div>
                        <div className="stat-label"><i className="fas fa-users"></i> Joined Communities</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">{stats.mySubmissions}</div>
                        <div className="stat-label"><i className="fas fa-upload"></i> My Submissions</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-5">
                    <h2 className="mb-3" style={{ color: 'var(--text-dark)' }}>Quick Actions</h2>
                    <div className="stats-grid">
                        {quickActions.map((action, idx) => (
                            <Link key={idx} to={action.link} className="card btn p-4 fade-in" style={{ borderLeft: `4px solid ${action.color}` }}>
                                <div className="mb-2" style={{ fontSize: 24, color: action.color }}><i className={`fas ${action.icon}`}></i></div>
                                <div className="card-title mb-1" style={{ color: 'var(--text-dark)' }}>{action.title}</div>
                                <div className="card-text text-secondary">{action.description}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Activity & Upcoming Events */}
                <div className="d-flex gap-4 flex-wrap">
                    {/* Recent Activity */}
                    <div className="card p-4 mb-4 fade-in" style={{ flex: 1, minWidth: 320 }}>
                        <h2 className="mb-3" style={{ color: 'var(--text-dark)' }}>Recent Activity</h2>
                        <div>
                            {recentActivity.length === 0 ? (
                                <div className="text-center text-secondary p-3">No recent activity.</div>
                            ) : recentActivity.map((activity) => (
                                <div key={activity.id} className="d-flex align-items-center gap-3 mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: activity.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                                        <i className={`fas ${activity.icon}`}></i>
                                    </div>
                                    <div>
                                        <div className="fw-bold" style={{ color: 'var(--text-dark)' }}>{activity.title}</div>
                                        <div className="text-secondary" style={{ fontSize: 13 }}>{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Upcoming Events */}
                    <div className="card p-4 mb-4 fade-in" style={{ flex: 1, minWidth: 320 }}>
                        <h2 className="mb-3" style={{ color: 'var(--text-dark)' }}>Upcoming Events</h2>
                        <div>
                            {upcomingEvents.length === 0 ? (
                                <div className="text-center text-secondary p-3">No upcoming events.</div>
                            ) : upcomingEvents.map((event) => (
                                <div key={event.id} className="mb-3 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <div className="fw-bold" style={{ color: 'var(--text-dark)' }}>{event.title}</div>
                                        <span className={`badge ${event.status === 'registered' ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: 13 }}>
                                            {event.status === 'registered' ? 'Registered' : 'Available'}
                                        </span>
                                    </div>
                                    <div className="d-flex gap-3 text-secondary" style={{ fontSize: 13 }}>
                                        <div><i className="fas fa-calendar"></i> {new Date(event.date).toLocaleDateString()}</div>
                                        <div><i className="fas fa-clock"></i> {event.time}</div>
                                        <div><i className="fas fa-map-marker-alt"></i> {event.location}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;