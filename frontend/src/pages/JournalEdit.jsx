// frontend/src/pages/JournalEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { journalService } from '../services/submission';

const JournalEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [journal, setJournal] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        thumbnailUrl: '',
        isPublic: false
    });
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        loadJournal();
    }, [id]);

    const loadJournal = async () => {
        try {
            setLoading(true);
            const response = await journalService.getJournalById(id);
            const journalData = response.data;

            // Check if user is owner
            if (journalData.userId !== user?.userId) {
                setError('You do not have permission to edit this journal');
                return;
            }

            setJournal(journalData);
            setFormData({
                title: journalData.title || '',
                content: journalData.content || '',
                thumbnailUrl: journalData.thumbnailUrl || '',
                isPublic: journalData.isPublic || false
            });
        } catch (error) {
            console.error('Error loading journal:', error);
            setError('Failed to load journal');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);

            await journalService.updateJournal(id, formData);
            setAlert({ type: 'success', message: 'Journal updated successfully!' });

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/journals');
            }, 2000);
        } catch (error) {
            console.error('Error updating journal:', error);
            setError('Failed to update journal');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/journals');
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading journal...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <div className="mt-3">
                        <button className="btn btn-secondary" onClick={() => navigate('/journals')}>
                            Back to Journals
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="journals-page">
            <div className="container">
                {/* Header */}
                <div className="mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <button
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={() => navigate('/journals')}
                                >
                                    Journals
                                </button>
                            </li>
                            <li className="breadcrumb-item active">Edit Journal</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="mb-2">
                                <i className="fas fa-edit me-2"></i>
                                Edit Journal
                            </h1>
                            <p className="text-muted mb-0">Make changes to your research journal</p>
                        </div>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                        {alert.message}
                        <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                    </div>
                )}

                {/* Edit Form */}
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">
                                    <i className="fas fa-file-alt me-2"></i>
                                    Journal Information
                                </h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">
                                            <i className="fas fa-heading me-1"></i>
                                            Title *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter journal title"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="content" className="form-label">
                                            <i className="fas fa-align-left me-1"></i>
                                            Content *
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="content"
                                            name="content"
                                            rows="12"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            placeholder="Write your journal content here..."
                                            required
                                        ></textarea>
                                        <div className="form-text">
                                            Use markdown formatting for better presentation
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="thumbnailUrl" className="form-label">
                                            <i className="fas fa-image me-1"></i>
                                            Thumbnail URL (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="thumbnailUrl"
                                            name="thumbnailUrl"
                                            value={formData.thumbnailUrl}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="isPublic"
                                                name="isPublic"
                                                checked={formData.isPublic}
                                                onChange={handleInputChange}
                                            />
                                            <label className="form-check-label" htmlFor="isPublic">
                                                <i className="fas fa-globe me-1"></i>
                                                Make this journal public
                                            </label>
                                            <div className="form-text">
                                                Public journals can be viewed by anyone. Private journals are only visible to you.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-1"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCancel}
                                            disabled={saving}
                                        >
                                            <i className="fas fa-times me-1"></i>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Journal Details
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <small className="text-muted d-block">Author</small>
                                    <strong>{journal?.userName || user?.name}</strong>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted d-block">Created</small>
                                    <strong>
                                        {journal?.createdAt ? new Date(journal.createdAt).toLocaleDateString() : 'Unknown'}
                                    </strong>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted d-block">Status</small>
                                    <span className={`badge ${formData.isPublic ? 'bg-success' : 'bg-warning text-dark'}`}>
                                        <i className={`fas ${formData.isPublic ? 'fa-globe' : 'fa-lock'} me-1`}></i>
                                        {formData.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted d-block">Views</small>
                                    <strong>0 views</strong>
                                </div>
                                <div>
                                    <small className="text-muted d-block">Citations</small>
                                    <strong>0 citations</strong>
                                </div>
                            </div>
                        </div>

                        <div className="card mt-3">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="fas fa-lightbulb me-2"></i>
                                    Writing Tips
                                </h6>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled small">
                                    <li className="mb-2">
                                        <i className="fas fa-check text-success me-1"></i>
                                        Use clear and descriptive titles
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-check text-success me-1"></i>
                                        Structure your content with headings
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-check text-success me-1"></i>
                                        Include relevant citations
                                    </li>
                                    <li className="mb-2">
                                        <i className="fas fa-check text-success me-1"></i>
                                        Preview before publishing
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalEdit;