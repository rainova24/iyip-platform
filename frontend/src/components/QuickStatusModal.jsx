// frontend/src/components/QuickStatusModal.jsx
import React, { useState } from 'react';
import { submissionService } from '../services/submission';

const QuickStatusModal = ({ submission, isOpen, onClose, onStatusUpdate }) => {
    const [newStatus, setNewStatus] = useState(submission?.status || 'PENDING');
    const [saving, setSaving] = useState(false);
    const [comment, setComment] = useState('');

    const handleStatusUpdate = async () => {
        if (!submission) return;

        try {
            setSaving(true);
            await submissionService.updateSubmissionStatus(submission.submissionId, newStatus);

            // Call the parent callback with updated submission
            onStatusUpdate({
                ...submission,
                status: newStatus
            });

            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': '#f1c40f',
            'APPROVED': '#2ecc71',
            'REJECTED': '#e74c3c'
        };
        return colors[status] || '#6c757d';
    };

    if (!isOpen || !submission) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={onClose}
                style={{ zIndex: 1040 }}
            ></div>

            {/* Modal */}
            <div
                className="modal fade show d-block"
                style={{ zIndex: 1050 }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">
                                <i className="fas fa-flag me-2"></i>
                                Quick Status Update
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            ></button>
                        </div>

                        <div className="modal-body">
                            {/* Submission Info */}
                            <div className="alert alert-light border">
                                <h6 className="mb-2">
                                    <i className="fas fa-file-alt me-1"></i>
                                    {submission.title}
                                </h6>
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                        By {submission.userName || 'Unknown'} • {submission.type}
                                    </small>
                                    <span
                                        className="badge"
                                        style={{
                                            backgroundColor: getStatusColor(submission.status),
                                            color: 'white'
                                        }}
                                    >
                                        {submission.status}
                                    </span>
                                </div>
                            </div>

                            {/* Status Selection */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="fas fa-exchange-alt me-1"></i>
                                    Change Status To:
                                </label>
                                <div className="row g-2">
                                    <div className="col-4">
                                        <div
                                            className={`status-option ${newStatus === 'PENDING' ? 'active' : ''}`}
                                            onClick={() => setNewStatus('PENDING')}
                                        >
                                            <div className="status-color" style={{ backgroundColor: '#f1c40f' }}></div>
                                            <span>Pending</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div
                                            className={`status-option ${newStatus === 'APPROVED' ? 'active' : ''}`}
                                            onClick={() => setNewStatus('APPROVED')}
                                        >
                                            <div className="status-color" style={{ backgroundColor: '#2ecc71' }}></div>
                                            <span>Approved</span>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div
                                            className={`status-option ${newStatus === 'REJECTED' ? 'active' : ''}`}
                                            onClick={() => setNewStatus('REJECTED')}
                                        >
                                            <div className="status-color" style={{ backgroundColor: '#e74c3c' }}></div>
                                            <span>Rejected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-3">
                                <label className="form-label">
                                    <i className="fas fa-comment me-1"></i>
                                    Comment (Optional)
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a note about this status change..."
                                ></textarea>
                            </div>

                            {/* Status Change Summary */}
                            {newStatus !== submission.status && (
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Status will be changed from <strong>{submission.status}</strong> to <strong>{newStatus}</strong>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
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
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .status-option {
                    padding: 1rem;
                    border: 2px solid #e9ecef;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                    background: white;
                }

                .status-option:hover {
                    border-color: #007bff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .status-option.active {
                    border-color: #007bff;
                    background: #f8f9fa;
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
                }

                .status-color {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    margin: 0 auto 0.5rem;
                }

                .status-option span {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #495057;
                }

                .modal-backdrop {
                    background-color: rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </>
    );
};

export default QuickStatusModal;