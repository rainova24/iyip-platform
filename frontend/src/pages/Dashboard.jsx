// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { journalService, submissionService } from '../services/submission';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        myJournals: 0,
        registeredEvents: 0,
        totalCommunities: 0,
        totalSubmissions: 0
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load data from real API endpoints
            const [journalsResponse, communitiesResponse, submissionsResponse] = await Promise.all([
                journalService.getUserJournals().catch(() => ({ data: [] })),
                api.get('/communities').catch(() => ({ data: [] })),
                submissionService.getUserSubmissions().catch(() => ({ data: [] }))
            ]);

            // Extract arrays safely
            const journals = Array.isArray(journalsResponse?.data) ? journalsResponse.data : [];
            const communities = Array.isArray(communitiesResponse?.data) ? communitiesResponse.data : [];
            const submissions = Array.isArray(submissionsResponse?.data) ? submissionsResponse.data : [];

            setStats({
                myJournals: journals.length,
                registeredEvents: 0, // You can add events API later
                totalCommunities: communities.length,
                totalSubmissions: submissions.length
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Set fallback values
            setStats({
                myJournals: 0,
                registeredEvents: 0,
                totalCommunities: 0,
                totalSubmissions: 0
            });
        } finally {
            setLoading(false);
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

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Welcome Header */}
                <div className="welcome-header">
                    <div className="welcome-content">
                        <div className="user-avatar-large">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="welcome-text">
                            <h1>Welcome, {user?.name || 'User'}!</h1>
                            <div className="user-info dark">
                                <span>
                                    <i className="fas fa-envelope"></i>
                                    {user?.email || 'user@example.com'}
                                </span>
                                <span>
                                    <i className="fas fa-user-tag"></i>
                                    {user?.roleName || 'Student'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overview Statistics */}
                <div className="stats-section">
                    <h2 className="section-title">Overview Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon journals">
                                    <i className="fas fa-book-open"></i>
                                </div>
                                <div className="stat-number">{stats.myJournals}</div>
                            </div>
                            <div className="stat-label">My Journals</div>
                            <div className="stat-description">Published research papers and articles</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon events">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <div className="stat-number">{stats.registeredEvents}</div>
                            </div>
                            <div className="stat-label">Registered Events</div>
                            <div className="stat-description">Upcoming events and workshops</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon communities">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="stat-number">{stats.totalCommunities}</div>
                            </div>
                            <div className="stat-label">Communities</div>
                            <div className="stat-description">Active research communities</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon submissions">
                                    <i className="fas fa-upload"></i>
                                </div>
                                <div className="stat-number">{stats.totalSubmissions}</div>
                            </div>
                            <div className="stat-label">Submissions</div>
                            <div className="stat-description">Pending and approved submissions</div>
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
                            <button className="btn btn-primary">
                                <i className="fas fa-edit"></i> New Journal
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-calendar-plus"></i>
                            </div>
                            <h3>Join Event</h3>
                            <p>Browse and register for upcoming events</p>
                            <button className="btn btn-outline">
                                <i className="fas fa-search"></i> Browse Events
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>Join Community</h3>
                            <p>Connect with like-minded researchers</p>
                            <button className="btn btn-outline">
                                <i className="fas fa-handshake"></i> Explore Communities
                            </button>
                        </div>

                        <div className="action-card">
                            <div className="action-icon">
                                <i className="fas fa-upload"></i>
                            </div>
                            <h3>Submit Material</h3>
                            <p>Submit research materials or facility requests</p>
                            <button className="btn btn-primary">
                                <i className="fas fa-paper-plane"></i> New Submission
                            </button>
                        </div>
                    </div>
                </div>
                {/* Recent Activity */}
                <div className="recent-activity-section">
                    <h2 className="section-title">Recent Activity</h2>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-book"></i>
                            </div>
                            <div className="activity-content">
                                <h4>Journal Published</h4>
                                <p>Your journal "AI Research Methods" has been published</p>
                                <span className="activity-time">2 hours ago</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-calendar"></i>
                            </div>
                            <div className="activity-content">
                                <h4>Event Registration</h4>
                                <p>You've registered for "Tech Innovation Summit 2025"</p>
                                <span className="activity-time">1 day ago</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="activity-content">
                                <h4>Joined Community</h4>
                                <p>You joined "AI Research Network" community</p>
                                <span className="activity-time">3 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;