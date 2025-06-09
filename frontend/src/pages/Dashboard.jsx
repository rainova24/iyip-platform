// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [stats, setStats] = useState({
        upcomingEvents: 0,
        myJournals: 0,
        mySubmissions: 0,
        myCommunities: 0
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Mock data for now - you can replace with actual API calls later
    useEffect(() => {
        // Simulate loading stats
        setStats({
            upcomingEvents: 3,
            myJournals: 5,
            mySubmissions: 2,
            myCommunities: 4
        });
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <h1 className="mb-4">Welcome back, {user?.name}!</h1>

                    {/* Stats Cards */}
                    <div className="row mb-4">
                        <div className="col-md-3 mb-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h2 className="card-title text-primary">{stats.upcomingEvents}</h2>
                                    <p className="card-text">Upcoming Events</p>
                                    <Link to="/events" className="btn btn-outline-primary btn-sm">
                                        View All
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h2 className="card-title text-success">{stats.myJournals}</h2>
                                    <p className="card-text">My Journals</p>
                                    <Link to="/journals" className="btn btn-outline-success btn-sm">
                                        Manage
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h2 className="card-title text-warning">{stats.mySubmissions}</h2>
                                    <p className="card-text">My Submissions</p>
                                    <Link to="/submissions" className="btn btn-outline-warning btn-sm">
                                        View All
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h2 className="card-title text-info">{stats.myCommunities}</h2>
                                    <p className="card-text">My Communities</p>
                                    <Link to="/communities" className="btn btn-outline-info btn-sm">
                                        Explore
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-2">
                                    <Link to="/journals" className="btn btn-primary w-100">
                                        📝 Create Journal
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <Link to="/submissions" className="btn btn-success w-100">
                                        📤 New Submission
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <Link to="/events" className="btn btn-info w-100">
                                        📅 Browse Events
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-2">
                                    <Link to="/communities" className="btn btn-warning w-100">
                                        👥 Join Communities
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card">
                        <div className="card-header">
                            <h3>Recent Activity</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <h5>Recent Events</h5>
                                    <p className="text-muted">No recent events</p>
                                    <Link to="/events" className="btn btn-outline-primary btn-sm">
                                        View all events →
                                    </Link>
                                </div>
                                <div className="col-md-4">
                                    <h5>Recent Journals</h5>
                                    <p className="text-muted">No recent journals</p>
                                    <Link to="/journals" className="btn btn-outline-success btn-sm">
                                        View all journals →
                                    </Link>
                                </div>
                                <div className="col-md-4">
                                    <h5>Recent Submissions</h5>
                                    <p className="text-muted">No recent submissions</p>
                                    <Link to="/submissions" className="btn btn-outline-warning btn-sm">
                                        View all submissions →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;