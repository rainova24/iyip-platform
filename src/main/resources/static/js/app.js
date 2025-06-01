// Token handling
function saveToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

function isLoggedIn() {
    return getToken() !== null;
}

// API calls
async function login(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        saveToken(data.token);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function register(name, email, password) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

async function fetchTransactions() {
    try {
        const response = await fetch('/api/transactions/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch transactions error:', error);
        throw error;
    }
}

async function createTransaction(transactionData) {
    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            throw new Error('Failed to create transaction');
        }

        return await response.json();
    } catch (error) {
        console.error('Create transaction error:', error);
        throw error;
    }
}

async function updateTransaction(id, transactionData) {
    try {
        // Make sure to include userId in the transactionData
        const response = await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            throw new Error('Failed to update transaction');
        }

        return await response.json();
    } catch (error) {
        console.error('Update transaction error:', error);
        throw error;
    }
}

async function deleteTransaction(id) {
    try {
        const response = await fetch(`/api/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete transaction');
        }

        return true;
    } catch (error) {
        console.error('Delete transaction error:', error);
        throw error;
    }
}

// UI functions
function showAlert(message, type = 'danger') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.container');
    const panel = document.querySelector('.panel');
    container.insertBefore(alertDiv, panel);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', function() {
    const protectedPages = ['dashboard.html'];
    const publicPages = ['login.html', 'register.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        window.location.href = 'login.html';
    } else if (publicPages.includes(currentPage) && isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }

    // Setup logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            removeToken();
            window.location.href = 'login.html';
        });
    }
});