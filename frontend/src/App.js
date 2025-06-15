// frontend/src/App.js
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

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="App">
            {/* Only show Navbar for authenticated users or on Home page */}
            <Routes>
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