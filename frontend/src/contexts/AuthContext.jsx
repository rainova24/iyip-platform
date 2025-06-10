import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:8080/api';

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
        return config;
    },
    (error) => Promise.reject(error)
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

                // Verify token is still valid
                verifyToken(token);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                logout();
            }
        }

        setLoading(false);
    }, []);

    const verifyToken = async (token) => {
        try {
            // You can add an endpoint to verify token validity
            const response = await axios.get('/auth/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.data.valid) {
                logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login', {
                email,
                password
            });

            const { user: userData, token } = response.data;

            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Update state
            setUser(userData);
            setIsAuthenticated(true);

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
            const response = await axios.post('/auth/register', userData);

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