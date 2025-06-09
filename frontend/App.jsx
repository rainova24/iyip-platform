import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Journals from './pages/Journals';
import JournalDetail from './pages/JournalDetail';
import CreateJournal from './pages/CreateJournal';
import Submissions from './pages/Submissions';
import CreateSubmission from './pages/CreateSubmission';
import Communities from './pages/Communities';
import Profile from './pages/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/events/:id" element={<EventDetail />} />
                        <Route path="/journals" element={<Journals />} />
                        <Route path="/journals/:id" element={<JournalDetail />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/my-journals"
                            element={
                                <ProtectedRoute>
                                    <Journals userOnly={true} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-journal"
                            element={
                                <ProtectedRoute>
                                    <CreateJournal />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/edit-journal/:id"
                            element={
                                <ProtectedRoute>
                                    <CreateJournal editMode={true} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/submissions"
                            element={
                                <ProtectedRoute>
                                    <Submissions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-submission"
                            element={
                                <ProtectedRoute>
                                    <CreateSubmission />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/communities"
                            element={
                                <ProtectedRoute>
                                    <Communities />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;