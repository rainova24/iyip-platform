// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    IYIP Platform
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/journals">Journals</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/events">Events</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/submissions">Submissions</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/communities">Communities</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        {isAuthenticated ? (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {user?.name || 'User'}
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">Profile</Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;