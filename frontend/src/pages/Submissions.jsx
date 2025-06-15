// frontend/src/pages/Submissions.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { submissionService } from '../services/submission';

const Submissions = () => {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'MATERIAL',
        title: '',
        content: '',
        fileUrl: ''
    });

    const { user } = useAuth();

    useEffect(() => {
        loadSubmissions();
    }, []);

    const loadSubmissions = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            // Check if user is admin - if so, get all submissions
            if (user?.roleName === 'ADMIN') {
                response = await submissionService.getAllSubmissions();
            } else {
                response = await submissionService.getUserSubmissions();
            }

            // Ensure we have an array from the response
            const submissionsData = response?.data || [];
            setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);

        } catch (error) {
            console.error('Error loading submissions:', error);
            setError('Failed to load submissions');
            setSubmissions([]); // Set empty array as fallback
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submissionService.createSubmission(formData);
            setAlert({ type: 'success', message: 'Submission created successfully!' });
            setShowForm(false);
            setFormData({
                type: 'MATERIAL',
                title: '',
                content: '',
                fileUrl: ''
            });
            loadSubmissions();
        } catch (error) {
            console.error('Error creating submission:', error);
            setAlert({ type: 'error', message: 'Failed to create submission' });
        }

        // Clear alert after 3 seconds
        setTimeout(() => setAlert(null), 3000);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'PENDING': 'bg-warning text-dark',
            'APPROVED': 'bg-success',
            'REJECTED': 'bg-danger'
        };
        return statusClasses[status] || 'bg-secondary';
    };

    const getTypeIcon = (type) => {
        return type === 'MATERIAL' ? 'fas fa-file-alt' : 'fas fa-building';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading submissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="submissions-page">
            <div className="container">
                {/* Header */}
                <div className="submissions-header bg-primary text-white rounded p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1>
                                <i className="fas fa-paper-plane me-3"></i>
                                {user?.roleName === 'ADMIN' ? 'All Submissions' : 'My Submissions'}
                            </h1>
                            <p className="mb-0">
                                {user?.roleName === 'ADMIN'
                                    ? 'Manage all material and facility submissions'
                                    : 'Track your material and facility submissions'
                                }
                            </p>
                        </div>
                        <button
                            className="btn btn-light"
                            onClick={() => setShowForm(!showForm)}
                            style={{ display: user?.roleName === 'ADMIN' ? 'none' : 'block' }}
                        >
                            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} me-2`}></i>
                            {showForm ? 'Cancel' : 'New Submission'}
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="stats-grid mb-4">
                    <div className="stat-card text-center">
                        <div className="stat-number" style={{color: '#FF6B35', fontSize: '3rem', fontWeight: '900', textShadow: '0 2px 4px rgba(142, 53, 21, 0.2)'}}>{submissions.length}</div>
                        <div className="stat-label">Total Submissions</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="stat-number" style={{color: '#FF6B35', fontSize: '3rem', fontWeight: '900', textShadow: '0 2px 4px rgba(142, 53, 21, 0.2)'}}>{submissions.filter(s => s.status === 'PENDING').length}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="stat-number" style={{color: '#FF6B35', fontSize: '3rem', fontWeight: '900', textShadow: '0 2px 4px rgba(142, 53, 21, 0.2)'}}>{submissions.filter(s => s.status === 'APPROVED').length}</div>
                        <div className="stat-label">Approved</div>
                    </div>
                    <div className="stat-card text-center">
                        <div className="stat-number" style={{color: '#FF6B35', fontSize: '3rem', fontWeight: '900', textShadow: '0 2px 4px rgba(142, 53, 21, 0.2)'}}>{submissions.filter(s => s.status === 'REJECTED').length}</div>
                        <div className="stat-label">Rejected</div>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type === 'error' ? 'danger' : alert.type} alert-dismissible fade show`}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                        {alert.message}
                        <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                    </div>
                )}

                {/* Submission Form */}
                {showForm && (
                    <div className="card mb-4">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-plus me-2"></i>
                                Create New Submission
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="type" className="form-label">
                                                <i className="fas fa-tag me-1"></i> Type
                                            </label>
                                            <select
                                                className="form-select"
                                                id="type"
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="MATERIAL">Material Submission</option>
                                                <option value="FASILITAS">Facility Request</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">
                                                <i className="fas fa-heading me-1"></i> Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="Enter submission title"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">
                                        <i className="fas fa-align-left me-1"></i> Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        name="content"
                                        rows="4"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        placeholder="Describe your submission..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fileUrl" className="form-label">
                                        <i className="fas fa-link me-1"></i> File URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        id="fileUrl"
                                        name="fileUrl"
                                        value={formData.fileUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/file.pdf"
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        <i className="fas fa-paper-plane me-1"></i>
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowForm(false)}
                                    >
                                        <i className="fas fa-times me-1"></i>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Submissions Grid */}
                <div className="row">
                    {submissions.length === 0 ? (
                        <div className="col-12">
                            <div className="empty-state text-center py-5">
                                <div className="empty-icon mb-3">
                                    <i className="fas fa-paper-plane fa-4x text-muted"></i>
                                </div>
                                <h3>
                                    {user?.roleName === 'ADMIN' ? 'No submissions in system' : 'No submissions yet'}
                                </h3>
                                <p className="text-muted">
                                    {user?.roleName === 'ADMIN'
                                        ? 'No submissions have been created by users yet.'
                                        : 'Create your first submission to get started!'
                                    }
                                </p>
                                {user?.roleName !== 'ADMIN' && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowForm(true)}
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Create Submission
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        submissions.map((submission) => (
                            <div key={submission.submissionId} className="col-md-6 col-lg-4 mb-4">
                                <div className="card h-100">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <i className={`${getTypeIcon(submission.type)} me-2`}></i>
                                            <span className="badge bg-primary">{submission.type}</span>
                                        </div>
                                        <span className={`badge ${getStatusBadge(submission.status)}`}>
                                            {submission.status}
                                        </span>
                                    </div>

                                    <div className="card-body">
                                        <h5 className="card-title">{submission.title}</h5>
                                        <p className="card-text text-muted">{submission.content}</p>

                                        {/* Show submitter info for admin */}
                                        {user?.roleName === 'ADMIN' && submission.userName && (
                                            <div className="mb-2">
                                                <small className="text-muted">
                                                    <i className="fas fa-user me-1"></i>
                                                    Submitted by: <strong>{submission.userName}</strong>
                                                </small>
                                            </div>
                                        )}

                                        {submission.fileUrl && (
                                            <div className="mb-3">
                                                <a
                                                    href={submission.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="fas fa-external-link-alt me-1"></i>
                                                    View File
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer text-muted">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small>
                                                <i className="fas fa-clock me-1"></i>
                                                {formatDate(submission.submittedAt)}
                                            </small>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => navigate(`/submissions/${submission.submissionId}`)}
                                            >
                                                <i className="fas fa-eye me-1"></i>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Submissions;