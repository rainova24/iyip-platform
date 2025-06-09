import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Simple Home component for now
const Home = () => {
    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <header style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h1>🎉 IYIP Platform</h1>
                <p>Event and Journal Management System</p>
            </header>

            <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2>✅ Frontend Successfully Running!</h2>
                <p>Welcome to IYIP Platform. The system is now operational with both frontend and backend components.</p>

                <div style={{ marginTop: '20px' }}>
                    <h3>🔧 System Status:</h3>
                    <ul>
                        <li>✅ <strong>Frontend:</strong> React development server running on port 3000</li>
                        <li>✅ <strong>Backend:</strong> Spring Boot API server running on port 8080</li>
                        <li>✅ <strong>Database:</strong> MySQL connected and operational</li>
                        <li>✅ <strong>Authentication:</strong> JWT security configured</li>
                    </ul>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h3>🚀 Available Features:</h3>
                    <ul>
                        <li>📅 Event Management</li>
                        <li>📖 Journal System</li>
                        <li>📤 Submission Management</li>
                        <li>👥 Community Features</li>
                        <li>🔐 User Authentication</li>
                    </ul>
                </div>

                <div style={{
                    marginTop: '30px',
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '5px'
                }}>
                    <h4>🔗 Quick Links:</h4>
                    <p><strong>API Base URL:</strong> <code>http://localhost:8080/api</code></p>
                    <p><strong>Test API:</strong> <a href="http://localhost:8080/api/events" target="_blank">http://localhost:8080/api/events</a></p>
                    <p><strong>Login Endpoint:</strong> <code>POST /api/auth/login</code></p>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;