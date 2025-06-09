// frontend/src/pages/Submissions.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Submissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            const response = await authService.getMySubmissions();
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error loading submissions:', error);
            setError('Failed to load submissions');
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
            await authService.createSubmission(formData);
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
            setError('Failed to create submission');
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'PENDING': 'badge bg-warning',
            'APPROVED': 'badge bg-success',
            'REJECTED': 'badge bg-danger'
        };
        return statusClasses[status] || 'badge bg-secondary';
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Submissions</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'New Submission'}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Create New Submission</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="type" className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="MATERIAL">Material</option>
                                    <option value="FASILITAS">Fasilitas</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">Content</label>
                                <textarea
                                    className="form-control"
                                    id="content"
                                    name="content"
                                    rows="4"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileUrl" className="form-label">File URL</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    id="fileUrl"
                                    name="fileUrl"
                                    value={formData.fileUrl}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row">
                {submissions.length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info" role="alert">
                            No submissions found. Create your first submission!
                        </div>
                    </div>
                ) : (
                    submissions.map((submission) => (
                        <div key={submission.submissionId} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <span className="badge bg-primary">{submission.type}</span>
                                    <span className={getStatusBadge(submission.status)}>
                                        {submission.status}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{submission.title}</h5>
                                    <p className="card-text">{submission.content}</p>
                                    {submission.fileUrl && (
                                        <a
                                            href={submission.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            View File
                                        </a>
                                    )}
                                </div>
                                <div className="card-footer text-muted">
                                    <small>
                                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Submissions;