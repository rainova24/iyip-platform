// frontend/src/services/authService.js - DEBUG VERSION
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Debug function to check token
const debugToken = () => {
    const token = localStorage.getItem('token');
    console.log('🔍 Debug Token Check:', {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? token.substring(0, 20) + '...' : null
    });
    return token;
};

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = debugToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token added to request:', config.url);
        } else {
            console.warn('⚠️ No token found for request:', config.url);
        }

        console.log(`🚀 Making ${config.method?.toUpperCase()} request to:`, config.url);
        console.log('📋 Request headers:', config.headers);

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Handle responses and token expiration
api.interceptors.response.use(
    (response) => {
        console.log(`✅ Response from ${response.config.url}:`, {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });

        if (error.response?.status === 401) {
            console.warn('🔑 Authentication failed - clearing tokens');
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                console.log('🔄 Redirecting to login page');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

const authService = {
    setAuthToken: (token) => {
        if (token) {
            console.log('🔧 Setting auth token');
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            console.log('🗑️ Removing auth token');
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        }
    },

    login: (email, password) => {
        console.log('🔐 Attempting login for:', email);
        return api.post('/auth/login', { email, password });
    },

    register: (userData) => {
        console.log('📝 Attempting registration for:', userData.email);
        return api.post('/auth/register', userData);
    },

    // User services
    getCurrentUser: () => {
        console.log('👤 Getting current user');
        return api.get('/users/me');
    },

    // Journal services - Updated to match backend endpoints
    getJournals: () => {
        console.log('📚 Getting public journals');
        return api.get('/journals/public');
    },

    getMyJournals: () => {
        console.log('📖 Getting my journals');
        return api.get('/journals/my-journals');
    },

    createJournal: (journalData) => {
        console.log('✍️ Creating journal');
        return api.post('/journals', journalData);
    },

    updateJournal: (id, journalData) => {
        console.log('📝 Updating journal:', id);
        return api.put(`/journals/${id}`, journalData);
    },

    deleteJournal: (id) => {
        console.log('🗑️ Deleting journal:', id);
        return api.delete(`/journals/${id}`);
    },

    // Event services - Updated to match backend endpoints
    getEvents: () => {
        console.log('🎉 Getting all events');
        return api.get('/events');
    },

    getUpcomingEvents: () => {
        console.log('⏰ Getting upcoming events');
        return api.get('/events');
    },

    getMyEvents: () => {
        console.log('🎟️ Getting my events');
        // Backend uses /events/my-events, but since it requires auth and we don't have it implemented,
        // we'll return empty for now
        return Promise.resolve({ data: { success: true, data: [] } });
    },

    createEvent: (eventData) => {
        console.log('🎊 Creating event');
        return api.post('/events', eventData);
    },

    registerForEvent: (eventId) => {
        console.log('📝 Registering for event:', eventId);
        return api.post(`/events/${eventId}/register`);
    },

    unregisterFromEvent: (eventId) => {
        console.log('❌ Unregistering from event:', eventId);
        return api.delete(`/events/${eventId}/register`);
    },

    // Submission services - Updated to match backend endpoints
    getSubmissions: () => {
        console.log('📄 Getting my submissions');
        return api.get('/submissions/my-submissions');
    },

    getMySubmissions: () => {
        console.log('📋 Getting my submissions');
        return api.get('/submissions/my-submissions');
    },

    createSubmission: (submissionData) => {
        console.log('📤 Creating submission');
        return api.post('/submissions', submissionData);
    },

    updateSubmissionStatus: (id, status) => {
        console.log('🔄 Updating submission status:', id, status);
        return api.put(`/submissions/${id}/status`, { status });
    },

    // Community services - Updated to match backend endpoints
    getCommunities: () => {
        console.log('🏘️ Getting all communities');
        return api.get('/communities');
    },

    getMyCommunities: () => {
        console.log('🏠 Getting my communities');
        return api.get('/communities/my-communities');
    },

    joinCommunity: (communityId) => {
        console.log('➕ Joining community:', communityId);
        return api.post(`/communities/${communityId}/join`);
    },

    leaveCommunity: (communityId) => {
        console.log('➖ Leaving community:', communityId);
        return api.delete(`/communities/${communityId}/leave`);
    },

    createCommunity: (communityData) => {
        console.log('🏗️ Creating community');
        return api.post('/communities', communityData);
    },

    // Debug method to test authentication
    testAuth: () => {
        console.log('🧪 Testing authentication');
        return api.get('/communities/my-communities');
    }
};

export default authService;