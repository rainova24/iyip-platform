import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';
import { eventService } from '../services/event';
import { journalService } from '../services/journal';
import { submissionService } from '../services/submission';
import { communityService } from '../services/community';

const Dashboard = () => {
    const [stats, setStats] = useState({
        upcomingEvents: 0,
        myJournals: 0,
        mySubmissions: 0,
        myCommunities: 0
    });
    const [recentActivity, setRecentActivity] = useState({
        events: [],
        journals: [],
        submissions: []
    });
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load stats and recent activity in parallel
            const [
                userEvents,
                userJournals,
                userSubmissions,
                userCommunities,
                upcomingEvents
            ] = await Promise.all([
                eventService.getUserEvents(),
                journalService.getUserJournals(),
                submissionService.getUserSubmissions(),
                communityService.getUserCommunities(),
                eventService.getUpcomingEvents()
            ]);

            setStats({
                upcomingEvents: upcomingEvents.length,
                myJournals: userJournals.length,
                mySubmissions: userSubmissions.length,
                myCommunities: userCommunities.length
            });

            setRecentActivity({
                events: userEvents.slice(0, 3),
                journals: userJournals.slice(0, 3),
                submissions: userSubmissions.slice(0, 3)
            });

        } catch (error) {
            setAlert({ message: 'Failed to load dashboard data', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-danger'
        };
        return `badge ${statusClasses[status] || 'badge-secondary'}`;
    };

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />

            <div className="container">
                {alert && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}

                <div className="panel">
                    <h1 className="panel-header">Welcome back, {user?.name}!</h1>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{stats.upcomingEvents}</div>
                            <div className="stat-label">Upcoming Events</div>
                            <Link to="/events" className="stat-link">View All</Link>
                        </div>

                        <div className="stat-card">
                            <div className="stat-number">{stats.myJournals}</div>
                            <div className="stat-label">My Journals</div>
                            <Link to="/my-journals" className="stat-link">Manage</Link>
                        </div>

                        <div className="stat-card">
                            <div className="stat-number">{stats.mySubmissions}</div>
                            <div className="stat-label">My Submissions</div>
                            <Link to="/submissions" className="stat-link">View All</Link>
                        </div>

                        <div className="stat-card">
                            <div className="stat-number">{stats.myCommunities}</div>
                            <div className="stat-label">My Communities</div>
                            <Link to="/communities" className="stat-link">Explore</Link>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="action-buttons">
                            <Link to="/create-journal" className="btn">
                                <span>📝</span> Create Journal
                            </Link>
                            <Link to="/create-submission" className="btn">
                                <span>📤</span> New Submission
                            </Link>
                            <Link to="/events" className="btn">
                                <span>📅</span> Browse Events
                            </Link>
                            <Link to="/communities" className="btn">
                                <span>👥</span> Join Communities
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                        <h2>Recent Activity</h2>

                        <div className="activity-grid">
                            {/* Recent Events */}
                            <div className="activity-section">
                                <h3>My Recent Events</h3>
                                {recentActivity.events.length > 0 ? (
                                    <div className="activity-list">
                                        {recentActivity.events.map(event => (
                                            <div key={event.eventId} className="activity-item">
                                                <div className="activity-content">
                                                    <h4>{event.title}</h4>
                                                    <p>{formatDate(event.startDate)}</p>
                                                </div>
                                                <Link to={`/events/${event.eventId}`} className="btn btn-small">
                                                    View
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-activity">No recent events</p>
                                )}
                                <Link to="/events" className="view-all-link">View all events →</Link>
                            </div>

                            {/* Recent Journals */}
                            <div className="activity-section">
                                <h3>My Recent Journals</h3>
                                {recentActivity.journals.length > 0 ? (
                                    <div className="activity-list">
                                        {recentActivity.journals.map(journal => (
                                            <div key={journal.journalId} className="activity-item">
                                                <div className="activity-content">
                                                    <h4>{journal.title}</h4>
                                                    <p>{formatDate(journal.createdAt)}</p>
                                                    <span className={journal.isPublic ? 'badge badge-public' : 'badge badge-private'}>
                                                        {journal.isPublic ? 'Public' : 'Private'}
                                                    </span>
                                                </div>
                                                <Link to={`/journals/${journal.journalId}`} className="btn btn-small">
                                                    View
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-activity">No journals yet</p>
                                )}
                                <Link to="/my-journals" className="view-all-link">View all journals →</Link>
                            </div>

                            {/* Recent Submissions */}
                            <div className="activity-section">
                                <h3>My Recent Submissions</h3>
                                {recentActivity.submissions.length > 0 ? (
                                    <div className="activity-list">
                                        {recentActivity.submissions.map(submission => (
                                            <div key={submission.submissionId} className="activity-item">
                                                <div className="activity-content">
                                                    <h4>{submission.title}</h4>
                                                    <p>{formatDate(submission.submittedAt)}</p>
                                                    <span className={getStatusBadge(submission.status)}>
                                                        {submission.status}
                                                    </span>
                                                </div>
                                                <Link to={`/submissions/${submission.submissionId}`} className="btn btn-small">
                                                    View
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-activity">No submissions yet</p>
                                )}
                                <Link to="/submissions" className="view-all-link">View all submissions →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;