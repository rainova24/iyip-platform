// LANGKAH 4: Update App.js untuk menambahkan route admin
// File: frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';
import './styles/navbar.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Journals from './pages/Journals';
import JournalEdit from './pages/JournalEdit';
import Events from './pages/Events';
import Submissions from './pages/Submissions';
import SubmissionDetail from './pages/SubmissionDetail';
import Communities from './pages/Communities';
import UserInfo from './pages/UserInfo';
import UserManagement from './pages/UserManagement';

// Admin Components - TAMBAHAN BARU
import AdminUsers from './pages/AdminUsers';
import AdminUserEdit from './pages/AdminUserEdit';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Only Route Component
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (user?.roleName !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="App">
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <Home />
                        </>
                    }
                />
                <Route
                    path="/login"
                    element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
                />
                <Route
                    path="/register"
                    element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/journals"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <Journals />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/journals/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <JournalEdit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <Events />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/submissions"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <Submissions />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/submissions/:id"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <SubmissionDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/communities"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <Communities />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <UserInfo />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN ONLY ROUTES - TAMBAHAN BARU */}
                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <AdminUsers />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/users/:userId"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <AdminUserEdit />
                        </AdminRoute>
                    }
                />

                {/* Placeholder routes untuk admin lainnya */}
                <Route
                    path="/admin/analytics"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                <div className="text-center">
                                    <i className="fas fa-chart-bar text-6xl text-orange-500 mb-4"></i>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                                    <p className="text-gray-600">Coming soon...</p>
                                </div>
                            </div>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/settings"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                                <div className="text-center">
                                    <i className="fas fa-cogs text-6xl text-orange-500 mb-4"></i>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
                                    <p className="text-gray-600">Coming soon...</p>
                                </div>
                            </div>
                        </AdminRoute>
                    }
                />

                {/* Admin User Management (existing) */}
                <Route
                    path="/user-management"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <UserManagement />
                        </AdminRoute>
                    }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;