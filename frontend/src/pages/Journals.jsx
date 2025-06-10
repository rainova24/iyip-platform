// frontend/src/pages/Journals.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const Journals = () => {
    const { user } = useAuth();
    const [journals, setJournals] = useState([]);
    const [myJournals, setMyJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, public, my-journals
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = async () => {
        try {
            setLoading(true);

            // Load all journals and my journals
            const [allJournalsResponse, myJournalsResponse] = await Promise.all([
                authService.getJournals().catch(() => ({ data: [] })),
                authService.getMyJournals().catch(() => ({ data: [] }))
            ]);

            setJournals(allJournalsResponse.data || []);
            setMyJournals(myJournalsResponse.data || []);
        } catch (error) {
            console.error('Error loading journals:', error);
            // Use demo data if API fails
            setJournals([
                {
                    journalId: 1,
                    title: "AI in Healthcare: A Comprehensive Study",
                    content: "This research explores the application of artificial intelligence in modern healthcare systems...",
                    author: "Dr. Sarah Johnson",
                    isPublic: true,
                    createdAt: "2025-05-15T10:30:00Z",
                    views: 1250,
                    citations: 15
                },
                {
                    journalId: 2,
                    title: "Blockchain Technology for Secure Transactions",
                    content: "An in-depth analysis of blockchain implementation in financial systems...",
                    author: "Prof. Michael Chen",
                    isPublic: true,
                    createdAt: "2025-04-22T14:15:00Z",
                    views: 890,
                    citations: 8
                },
                {
                    journalId: 3,
                    title: "Sustainable Energy Solutions for Smart Cities",
                    content: "Research on renewable energy integration in urban planning...",
                    author: "Dr. Emily Davis",
                    isPublic: true,
                    createdAt: "2025-03-10T09:45:00Z",
                    views: 2100,
                    citations: 23
                },
                {
                    journalId: 4,
                    title: "Machine Learning Applications in Education",
                    content: "Exploring how ML can enhance personalized learning experiences...",
                    author: "Prof. David Wilson",
                    isPublic: false,
                    createdAt: "2025-02-28T16:20:00Z",
                    views: 450,
                    citations: 5
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJournal = () => {
        // Redirect to create journal page or open modal
        setAlert({ type: 'info', message: 'Create journal functionality will be implemented soon!' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isMyJournal = (journalId) => {
        return myJournals.some(journal => journal.journalId === journalId);
    };

    const filteredJournals = journals.filter(journal => {
        switch (filter) {
            case 'public':
                return journal.isPublic;
            case 'my-journals':
                return isMyJournal(journal.journalId);
            default:
                return true;
        }
    });

    if (loading) {
        return (
            <div className="journals-page">
                <div className="journals-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading journals...</p>
                    </div>
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
                        <h1>Academic Journals</h1>
                        <p>Discover research papers, publications, and academic resources</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={handleCreateJournal}>
                            <i className="fas fa-plus"></i>
                            Create New Journal
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="journals-stats">
                    <div className="stat-item">
                        <span className="stat-number">{journals.length}</span>
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
                    <div className={`alert alert-${alert.type}`}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : alert.type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                        {alert.message}
                        <button className="alert-close" onClick={() => setAlert(null)}>×</button>
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
                                                    <i className="fas fa-crown"></i>
                                                    Owner
                                                </span>
                                            )}
                                        </div>
                                        <div className="journal-meta">
                                            <span className="journal-date">{formatDate(journal.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className="journal-card-content">
                                        <h3 className="journal-title">{journal.title}</h3>
                                        <p className="journal-author">By {journal.author || user?.name || 'Unknown Author'}</p>
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