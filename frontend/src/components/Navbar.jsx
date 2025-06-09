// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#007bff',
            padding: '1rem',
            zIndex: 1000
        }}>
            <div style={{ color: 'white', display: 'flex', gap: '1rem' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
                <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            </div>
        </nav>
    );
}