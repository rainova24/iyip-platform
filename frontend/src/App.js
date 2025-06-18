// frontend/src/App.js - CORRECTED VERSION
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
import EditUser from './pages/EditUser';         // NEW IMPORT
import AddUser from './pages/AddUser';           // NEW IMPORT

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component (EXISTING)
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Admin Only Route Component (EXISTING)
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

                {/* Admin Only Routes */}
                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <UserManagement />
                        </AdminRoute>
                    }
                />

                {/* NEW ADMIN ROUTES */}
                <Route
                    path="/admin/users/add"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <AddUser />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/users/edit/:userId"
                    element={
                        <AdminRoute>
                            <Navbar />
                            <EditUser />
                        </AdminRoute>
                    }
                />

                {/* Fallback route */}
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