// frontend/src/pages/SubmissionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { submissionService } from '../services/submission';

const SubmissionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submission, setSubmission] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        loadSubmission();
    }, [id]);

    const loadSubmission = async () => {
        try {
            setLoading(true);
            const response = await submissionService.getSubmissionById(id);
            const submissionData = response.data;

            setSubmission(submissionData);
            setNewStatus(submissionData.status || 'PENDING');
        } catch (error) {
            console.error('Error loading submission:', error);
            setError('Failed to load submission details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!user || user.roleName !== 'ADMIN') {
            setAlert({ type: 'error', message: 'Only admin can update submission status' });
            return;
        }

        try {
            setSaving(true);
            await submissionService.updateSubmissionStatus(id, newStatus);
            setSubmission(prev => ({ ...prev, status: newStatus }));
            setAlert({ type: 'success', message: 'Submission status updated successfully!' });
        } catch (error) {
            console.error('Error updating status:', error);
            setAlert({ type: 'error', message: 'Failed to update submission status' });
        } finally {
            setSaving(false);
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
            month: 'long',
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
                    <p className="mt-3">Loading submission details...</p>
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
                        <button className="btn btn-secondary" onClick={() => navigate('/submissions')}>
                            Back to Submissions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <i className="fas fa-info-circle me-2"></i>
                    Submission not found
                    <div className="mt-3">
                        <button className="btn btn-secondary" onClick={() => navigate('/submissions')}>
                            Back to Submissions
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="submissions-page">
            <div className="container">
                {/* Header */}
                <div className="mb-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <button
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={() => navigate('/submissions')}
                                >
                                    Submissions
                                </button>
                            </li>
                            <li className="breadcrumb-item active">Submission Details</li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="mb-2">
                                <i className="fas fa-file-alt me-2"></i>
                                Submission Details
                            </h1>
                            <p className="text-muted mb-0">View and manage submission information</p>
                        </div>
                        <button className="btn btn-outline-secondary" onClick={() => navigate('/submissions')}>
                            <i className="fas fa-arrow-left me-1"></i>
                            Back to List
                        </button>
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

                {/* Submission Details */}
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">
                                        <i className={`${getTypeIcon(submission.type)} me-2`}></i>
                                        {submission.title}
                                    </h5>
                                    <span className={`badge ${getStatusBadge(submission.status)}`}>
                                        {submission.status}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <h6 className="text-muted mb-2">
                                        <i className="fas fa-align-left me-1"></i>
                                        Description
                                    </h6>
                                    <div className="border rounded p-3 bg-light">
                                        <p className="mb-0">{submission.content}</p>
                                    </div>
                                </div>

                                {submission.fileUrl && (
                                    <div className="mb-4">
                                        <h6 className="text-muted mb-2">
                                            <i className="fas fa-paperclip me-1"></i>
                                            Attached File
                                        </h6>
                                        <a
                                            href={submission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="fas fa-external-link-alt me-1"></i>
                                            View File
                                        </a>
                                    </div>
                                )}

                                {/* Admin Status Update Section */}
                                {user?.roleName === 'ADMIN' && (
                                    <div className="mb-4">
                                        <div className="card bg-light">
                                            <div className="card-header bg-primary text-white">
                                                <h6 className="mb-0">
                                                    <i className="fas fa-user-shield me-1"></i>
                                                    Admin Actions
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row align-items-end">
                                                    <div className="col-md-6">
                                                        <label htmlFor="statusSelect" className="form-label">
                                                            <i className="fas fa-flag me-1"></i>
                                                            Update Status
                                                        </label>
                                                        <select
                                                            id="statusSelect"
                                                            className="form-select"
                                                            value={newStatus}
                                                            onChange={(e) => setNewStatus(e.target.value)}
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="APPROVED">Approved</option>
                                                            <option value="REJECTED">Rejected</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={handleStatusUpdate}
                                                            disabled={saving || newStatus === submission.status}
                                                        >
                                                            {saving ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                    Updating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="fas fa-save me-1"></i>
                                                                    Update Status
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                                {newStatus !== submission.status && (
                                                    <div className="alert alert-info mt-3 mb-0">
                                                        <i className="fas fa-info-circle me-1"></i>
                                                        Status will be changed from <strong>{submission.status}</strong> to <strong>{newStatus}</strong>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Submission Information
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <small className="text-muted d-block">Submission ID</small>
                                    <strong>#{submission.submissionId}</strong>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted d-block">Type</small>
                                    <span className="badge bg-primary">
                                        <i className={`${getTypeIcon(submission.type)} me-1`}></i>
                                        {submission.type}
                                    </span>
                                </div>
                                <div className="mb-3">
                                    <small className="text-muted d-block">Status</small>
                                    <span className={`badge ${getStatusBadge(submission.status)}`}>
                                        {submission.status}
                                    </span>
                                </div>
                                {submission.userName && (
                                    <div className="mb-3">
                                        <small className="text-muted d-block">Submitted by</small>
                                        <strong>{submission.userName}</strong>
                                    </div>
                                )}
                                <div className="mb-3">
                                    <small className="text-muted d-block">Submitted on</small>
                                    <strong>{formatDate(submission.submittedAt)}</strong>
                                </div>
                                {submission.updatedAt && submission.updatedAt !== submission.submittedAt && (
                                    <div className="mb-3">
                                        <small className="text-muted d-block">Last updated</small>
                                        <strong>{formatDate(submission.updatedAt)}</strong>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status History (Future Enhancement) */}
                        <div className="card mt-3">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="fas fa-history me-2"></i>
                                    Status History
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="timeline">
                                    <div className="timeline-item">
                                        <div className="timeline-marker bg-primary"></div>
                                        <div className="timeline-content">
                                            <h6 className="mb-1">Submitted</h6>
                                            <small className="text-muted">
                                                {formatDate(submission.submittedAt)}
                                            </small>
                                        </div>
                                    </div>
                                    {submission.status !== 'PENDING' && (
                                        <div className="timeline-item">
                                            <div className={`timeline-marker ${submission.status === 'APPROVED' ? 'bg-success' : 'bg-danger'}`}></div>
                                            <div className="timeline-content">
                                                <h6 className="mb-1">{submission.status}</h6>
                                                <small className="text-muted">
                                                    {formatDate(submission.updatedAt || submission.submittedAt)}
                                                </small>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card mt-3">
                            <div className="card-header">
                                <h6 className="card-title mb-0">
                                    <i className="fas fa-bolt me-2"></i>
                                    Quick Actions
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="d-grid gap-2">
                                    {submission.fileUrl && (
                                        <a
                                            href={submission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="fas fa-download me-1"></i>
                                            Download File
                                        </a>
                                    )}
                                    {user?.roleName === 'ADMIN' && (
                                        <>
                                            <button className="btn btn-outline-info btn-sm">
                                                <i className="fas fa-comment me-1"></i>
                                                Add Comment
                                            </button>
                                            <button className="btn btn-outline-secondary btn-sm">
                                                <i className="fas fa-print me-1"></i>
                                                Print Details
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetail;