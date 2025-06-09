import React, { useState, useEffect } from 'react';

const TransactionForm = ({ transaction, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        transactionType: '',
        amount: '',
        description: '',
        status: ''
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                transactionType: transaction.transactionType || '',
                amount: transaction.amount || '',
                description: transaction.description || '',
                status: transaction.status || ''
            });
        }
    }, [transaction]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div style={{ display: 'block', marginBottom: '30px' }}>
            <h2>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="transactionType">Transaction Type</label>
                    <select
                        id="transactionType"
                        name="transactionType"
                        value={formData.transactionType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="CREDIT">Credit</option>
                        <option value="DEBIT">Debit</option>
                        <option value="TRANSFER">Transfer</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                    </select>
                </div>
                <button type="submit" className="btn">Save Transaction</button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                    style={{ marginLeft: '10px' }}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;