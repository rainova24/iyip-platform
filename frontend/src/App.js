// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Journals from './pages/Journals';
import Events from './pages/Events';
import Submissions from './pages/Submissions';
import Communities from './pages/Communities';

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
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <div className="main-content">
                                <Dashboard />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/journals"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <div className="main-content">
                                <Journals />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <div className="main-content">
                                <Events />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/submissions"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <div className="main-content">
                                <Submissions />
                            </div>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/communities"
                    element={
                        <ProtectedRoute>
                            <Navbar />
                            <div className="main-content">
                                <Communities />
                            </div>
                        </ProtectedRoute>
                    }
                />
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