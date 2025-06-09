import React from 'react';

const TransactionList = ({ transactions, loading, onEdit, onDelete }) => {
    if (loading) {
        return <p>Loading transactions...</p>;
    }

    if (transactions.length === 0) {
        return <p>No transactions found.</p>;
    }

    return (
        <table className="table">
            <thead>
            <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((transaction) => {
                const date = new Date(transaction.transactionDate).toLocaleDateString();
                return (
                    <tr key={transaction.id}>
                        <td>{transaction.transactionType}</td>
                        <td>{transaction.amount}</td>
                        <td>{date}</td>
                        <td>{transaction.description || '-'}</td>
                        <td>{transaction.status}</td>
                        <td>
                            <button
                                className="btn"
                                onClick={() => onEdit(transaction)}
                                style={{ padding: '5px 10px', marginRight: '5px' }}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => onDelete(transaction.id)}
                                style={{ padding: '5px 10px' }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
};

export default TransactionList;