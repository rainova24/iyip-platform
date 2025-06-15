// frontend/src/services/api.js
import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        console.log(`Response from ${response.config.url}:`, response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Handle 404 errors
        if (error.response?.status === 404) {
            console.warn('Resource not found:', error.config.url);
        }

        // Handle 500 errors
        if (error.response?.status >= 500) {
            console.error('Server error:', error.response.data);
        }

        return Promise.reject(error);
    }
);

// Helper functions for setting/removing auth token
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    }
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
};

// Initialize token from localStorage on app start
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

export default api;