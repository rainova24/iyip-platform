// frontend/src/pages/Journals.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { journalService } from '../services/submission';

const Journals = () => {
    const [journals, setJournals] = useState([]);
    const [myJournals, setMyJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load public journals and user's journals
            const [publicResponse, myJournalsResponse] = await Promise.all([
                journalService.getPublicJournals().catch(() => ({ data: [] })),
                user ? journalService.getUserJournals().catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
            ]);

            // Ensure we have arrays
            const publicJournals = Array.isArray(publicResponse?.data) ? publicResponse.data : [];
            const userJournals = Array.isArray(myJournalsResponse?.data) ? myJournalsResponse.data : [];

            setJournals(publicJournals);
            setMyJournals(userJournals);
        } catch (error) {
            console.error('Error loading journals:', error);
            setError('Failed to load journals');
            // Set empty arrays as fallback
            setJournals([]);
            setMyJournals([]);
        } finally {
            setLoading(false);
        }
    };

    const isMyJournal = (journalId) => {
        return myJournals.some(journal => journal.journalId === journalId);
    };

    const getFilteredJournals = () => {
        let filtered = [];

        if (filter === 'all') {
            // Combine public journals and user's private journals
            const allJournals = [...journals, ...myJournals.filter(j => !j.isPublic)];
            // Remove duplicates based on journalId
            const uniqueJournals = allJournals.reduce((acc, current) => {
                const existing = acc.find(item => item.journalId === current.journalId);
                if (!existing) {
                    acc.push(current);
                }
                return acc;
            }, []);
            filtered = uniqueJournals;
        } else if (filter === 'public') {
            filtered = journals.filter(journal => journal.isPublic);
        } else if (filter === 'my-journals') {
            filtered = myJournals;
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(journal =>
                journal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                journal.content?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredJournals = getFilteredJournals();

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleCreateJournal = () => {
        // Navigate to create journal page or show form
        setAlert({ type: 'info', message: 'Create journal feature coming soon!' });
        setTimeout(() => setAlert(null), 3000);
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading journals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="journals-page">
            <div className="journals-container">
                {/* Header */}
                <div className="journals-header">
                    <div className="header-content">
                        <h1>
                            <i className="fas fa-book-open"></i>
                            Research Journals
                        </h1>
                        <p>Discover and share cutting-edge research findings</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={handleCreateJournal}>
                            <i className="fas fa-plus"></i>
                            Create Journal
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="journals-stats">
                    <div className="stat-item">
                        <span className="stat-number">{journals.length + myJournals.length}</span>
                        <span className="stat-label">Total Journals</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{journals.filter(j => j.isPublic).length}</span>
                        <span className="stat-label">Public</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{myJournals.length}</span>
                        <span className="stat-label">My Journals</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{journals.reduce((sum, j) => sum + (j.views || 0), 0)}</span>
                        <span className="stat-label">Total Views</span>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type === 'error' ? 'danger' : alert.type} alert-dismissible fade show`}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : alert.type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                        {alert.message}
                        <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                    </div>
                )}

                {/* Filters */}
                <div className="journals-filters">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <i className="fas fa-book-open"></i>
                            All Journals
                        </button>
                        <button
                            className={`filter-tab ${filter === 'public' ? 'active' : ''}`}
                            onClick={() => setFilter('public')}
                        >
                            <i className="fas fa-globe"></i>
                            Public
                        </button>
                        <button
                            className={`filter-tab ${filter === 'my-journals' ? 'active' : ''}`}
                            onClick={() => setFilter('my-journals')}
                        >
                            <i className="fas fa-user-edit"></i>
                            My Journals
                        </button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search journals..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Journals Grid */}
                <div className="journals-grid">
                    {filteredJournals.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-book-open"></i>
                            </div>
                            <h3>No journals found</h3>
                            <p>
                                {filter === 'my-journals'
                                    ? "You haven't created any journals yet."
                                    : filter === 'public'
                                        ? "No public journals available at the moment."
                                        : "No journals available."
                                }
                            </p>
                            {filter === 'my-journals' && (
                                <button className="btn btn-primary" onClick={handleCreateJournal}>
                                    Create Your First Journal
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredJournals.map(journal => {
                            const isOwner = isMyJournal(journal.journalId);

                            return (
                                <div key={journal.journalId} className={`journal-card ${!journal.isPublic ? 'private' : ''}`}>
                                    <div className="journal-card-header">
                                        <div className="journal-badges">
                                            {!journal.isPublic && (
                                                <span className="badge badge-private">
                                                    <i className="fas fa-lock"></i>
                                                    Private
                                                </span>
                                            )}
                                            {journal.isPublic && (
                                                <span className="badge badge-public">
                                                    <i className="fas fa-globe"></i>
                                                    Public
                                                </span>
                                            )}
                                            {isOwner && (
                                                <span className="badge badge-owner">
                                                    <i className="fas fa-user"></i>
                                                    Mine
                                                </span>
                                            )}
                                        </div>

                                        <div className="journal-meta">
                                            <span className="journal-date">{formatDate(journal.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="journal-card-content">
                                        <h3 className="journal-title">{journal.title}</h3>
                                        <p className="journal-author">By {journal.userName || 'Unknown Author'}</p>
                                        <p className="journal-excerpt">
                                            {journal.content?.substring(0, 120)}...
                                        </p>

                                        <div className="journal-stats">
                                            <div className="stat-item">
                                                <i className="fas fa-eye"></i>
                                                <span>{journal.views || 0} views</span>
                                            </div>
                                            <div className="stat-item">
                                                <i className="fas fa-quote-right"></i>
                                                <span>{journal.citations || 0} citations</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="journal-card-actions">
                                        <Link
                                            to={`/journals/${journal.journalId}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <i className="fas fa-eye"></i>
                                            Read More
                                        </Link>

                                        {isOwner && (
                                            <Link
                                                to={`/journals/${journal.journalId}/edit`}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                <i className="fas fa-edit"></i>
                                                Edit
                                            </Link>
                                        )}

                                        <button className="btn btn-primary btn-sm">
                                            <i className="fas fa-share"></i>
                                            Share
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Journals;