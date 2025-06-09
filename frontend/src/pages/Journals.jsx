import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';
import { journalService } from '../services/journal';

const Journals = ({ userOnly = false }) => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadJournals();
    }, [userOnly]);

    const loadJournals = async () => {
        try {
            setLoading(true);
            let data;
            if (userOnly && user) {
                data = await journalService.getUserJournals();
            } else {
                data = await journalService.getPublicJournals();
            }
            setJournals(data);
        } catch (error) {
            setAlert({ message: 'Failed to load journals', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchKeyword.trim()) {
            loadJournals();
            return;
        }

        try {
            setLoading(true);
            const data = await journalService.searchJournals(searchKeyword);
            setJournals(data);
        } catch (error) {
            setAlert({ message: 'Failed to search journals', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (journalId) => {
        if (!window.confirm('Are you sure you want to delete this journal?')) return;

        try {
            await journalService.deleteJournal(journalId);
            setAlert({ message: 'Journal deleted successfully', type: 'success' });
            loadJournals();
        } catch (error) {
            setAlert({ message: 'Failed to delete journal', type: 'danger' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateContent = (content, maxLength = 200) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h1 className="panel-header">
                            {userOnly ? 'My Journals' : 'Public Journals'}
                        </h1>

                        {user && (
                            <Link to="/create-journal" className="btn">
                                Create New Journal
                            </Link>
                        )}
                    </div>

                    {!userOnly && (
                        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Search journals..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button onClick={handleSearch} className="btn">
                                Search
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Loading journals...</p>
                        </div>
                    ) : journals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>{userOnly ? 'You haven\'t created any journals yet.' : 'No public journals found.'}</p>
                            {userOnly && user && (
                                <Link to="/create-journal" className="btn" style={{ marginTop: '10px' }}>
                                    Create Your First Journal
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="journals-grid">
                            {journals.map(journal => (
                                <div key={journal.journalId} className="journal-card">
                                    {journal.thumbnailUrl && (
                                        <div className="journal-thumbnail">
                                            <img
                                                src={journal.thumbnailUrl}
                                                alt={journal.title}
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}

                                    <div className="journal-content">
                                        <h3>{journal.title}</h3>
                                        <p className="journal-meta">
                                            By {journal.userName} • {formatDate(journal.createdAt)}
                                            {journal.isPublic ? (
                                                <span className="badge badge-public">Public</span>
                                            ) : (
                                                <span className="badge badge-private">Private</span>
                                            )}
                                        </p>
                                        <p>{truncateContent(journal.content)}</p>
                                    </div>

                                    <div className="journal-actions">
                                        <Link to={`/journals/${journal.journalId}`} className="btn btn-secondary">
                                            Read More
                                        </Link>

                                        {userOnly && user && (
                                            <div style={{ marginLeft: '10px', display: 'flex', gap: '5px' }}>
                                                <Link
                                                    to={`/edit-journal/${journal.journalId}`}
                                                    className="btn btn-outline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(journal.journalId)}
                                                    className="btn btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Journals;