// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add token to requests if it exists
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle responses and token expiration
axios.interceptors.response.use(
    (response) => {
        console.log(`Response from ${response.config.url}:`, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
                console.log('Restored user from localStorage:', userData);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                logout();
            }
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log('Attempting login for:', email);

            const response = await axios.post('/auth/login', {
                email,
                password
            });

            console.log('Login response:', response.data);

            // Handle different response formats
            let userData, token;

            if (response.data.success) {
                // Backend returns { success: true, data: { token, user } }
                userData = response.data.data?.user || response.data.user;
                token = response.data.data?.token || response.data.token;
            } else {
                // Direct response format
                userData = response.data.user;
                token = response.data.token;
            }

            if (!token || !userData) {
                throw new Error('Invalid response format: missing token or user data');
            }

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

            console.log('Login successful for user:', userData);

            return {
                success: true,
                user: userData
            };
        } catch (error) {
            console.error('Login error:', error);

            let message = 'Login failed. Please try again.';

            if (error.response) {
                if (error.response.status === 401) {
                    message = 'Invalid email or password.';
                } else if (error.response.data?.message) {
                    message = error.response.data.message;
                }
            } else if (error.request) {
                message = 'Cannot connect to server. Please check your connection.';
            }

            return {
                success: false,
                message
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('Attempting registration for:', userData.email);

            const response = await axios.post('/auth/register', userData);

            console.log('Registration response:', response.data);

            return {
                success: true,
                message: 'Registration successful! Please login.'
            };
        } catch (error) {
            console.error('Registration error:', error);

            let message = 'Registration failed. Please try again.';

            if (error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error.response?.status === 400) {
                message = 'Email or NIM already registered.';
            }

            return {
                success: false,
                message
            };
        }
    };

    const logout = () => {
        console.log('Logging out user');

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Clear axios default header
        delete axios.defaults.headers.common['Authorization'];

        // Update state
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Updated user data:', userData);
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};