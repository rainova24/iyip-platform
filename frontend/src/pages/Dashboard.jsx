import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';
import TransactionForm from '../components/dashboard/TransactionForm';
import TransactionList from '../components/dashboard/TransactionList';
import { transactionService } from '../services/transaction';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const data = await transactionService.getUserTransactions();
            setTransactions(data);
        } catch (error) {
            showAlert('Failed to load transactions', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (message, type = 'danger') => {
        setAlert({ message, type });
    };

    const handleNewTransaction = () => {
        setEditingTransaction(null);
        setShowForm(true);
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const handleDeleteTransaction = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await transactionService.deleteTransaction(id);
            showAlert('Transaction deleted successfully', 'success');
            loadTransactions();
        } catch (error) {
            showAlert('Failed to delete transaction', 'danger');
        }
    };

    const handleFormSubmit = async (transactionData) => {
        try {
            if (editingTransaction) {
                await transactionService.updateTransaction(editingTransaction.id, transactionData);
                showAlert('Transaction updated successfully', 'success');
            } else {
                await transactionService.createTransaction(transactionData);
                showAlert('Transaction created successfully', 'success');
            }
            setShowForm(false);
            loadTransactions();
        } catch (error) {
            showAlert('Failed to save transaction', 'danger');
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTransaction(null);
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

                {/* Orange Welcome Panel */}
                <div className="orange-panel">
                    <h2>Selamat Datang di IYIP Platform</h2>
                    <p>Kelola transaksi Anda dengan mudah dan aman menggunakan platform kami.</p>
                </div>

                <div className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h1 className="panel-header">Transaction Dashboard</h1>
                        <button
                            onClick={handleNewTransaction}
                            className="btn"
                            style={{ marginBottom: '20px' }}
                        >
                            New Transaction
                        </button>
                    </div>

                    {/* Transaction Form */}
                    {showForm && (
                        <TransactionForm
                            transaction={editingTransaction}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCancelForm}
                        />
                    )}

                    {/* Transactions Container */}
                    <div>
                        <h2>Your Transactions</h2>
                        <TransactionList
                            transactions={transactions}
                            loading={loading}
                            onEdit={handleEditTransaction}
                            onDelete={handleDeleteTransaction}
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;