// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Set auth token
const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Auth services
const authService = {
    setAuthToken,

    login: (email, password) => {
        return api.post('/auth/login', { email, password });
    },

    register: (userData) => {
        return api.post('/auth/register', userData);
    },

    // User services
    getCurrentUser: () => {
        return api.get('/users/me');
    },

    // Journal services
    getJournals: () => {
        return api.get('/journals');
    },

    getMyJournals: () => {
        return api.get('/journals/my');
    },

    createJournal: (journalData) => {
        return api.post('/journals', journalData);
    },

    updateJournal: (id, journalData) => {
        return api.put(`/journals/${id}`, journalData);
    },

    deleteJournal: (id) => {
        return api.delete(`/journals/${id}`);
    },

    // Event services
    getEvents: () => {
        return api.get('/events');
    },

    getUpcomingEvents: () => {
        return api.get('/events/upcoming');
    },

    getMyEvents: () => {
        return api.get('/events/my');
    },

    createEvent: (eventData) => {
        return api.post('/events', eventData);
    },

    registerForEvent: (eventId) => {
        return api.post(`/events/${eventId}/register`);
    },

    unregisterFromEvent: (eventId) => {
        return api.delete(`/events/${eventId}/register`);
    },

    // Submission services
    getSubmissions: () => {
        return api.get('/submissions');
    },

    getMySubmissions: () => {
        return api.get('/submissions/my');
    },

    createSubmission: (submissionData) => {
        return api.post('/submissions', submissionData);
    },

    updateSubmissionStatus: (id, status) => {
        return api.put(`/submissions/${id}/status`, { status });
    },

    // Community services
    getCommunities: () => {
        return api.get('/communities');
    },

    getMyCommunities: () => {
        return api.get('/communities/my');
    },

    joinCommunity: (communityId) => {
        return api.post(`/communities/${communityId}/join`);
    },

    leaveCommunity: (communityId) => {
        return api.delete(`/communities/${communityId}/leave`);
    },

    createCommunity: (communityData) => {
        return api.post('/communities', communityData);
    }
};

export default authService;