// File lengkap: frontend/src/services/submission.js
import api from './api';

// Journal Service
export const journalService = {
    getPublicJournals: async () => {
        const response = await api.get('/journals/public');
        return response.data;
    },

    getAllJournals: async () => {
        const response = await api.get('/journals');
        return response.data;
    },

    getUserJournals: async () => {
        const response = await api.get('/journals/my-journals');
        return response.data;
    },

    getJournalById: async (id) => {
        const response = await api.get(`/journals/${id}`);
        return response.data;
    },

    createJournal: async (journalData) => {
        const response = await api.post('/journals', journalData);
        return response.data;
    },

    updateJournal: async (id, journalData) => {
        const response = await api.put(`/journals/${id}`, journalData);
        return response.data;
    },

    deleteJournal: async (id) => {
        await api.delete(`/journals/${id}`);
    },

    searchJournals: async (keyword) => {
        const response = await api.get(`/journals/search?keyword=${encodeURIComponent(keyword)}`);
        return response.data;
    }
};

// Submission Service
export const submissionService = {
    getUserSubmissions: async () => {
        const response = await api.get('/submissions/my-submissions');
        return response.data;
    },

    getAllSubmissions: async () => {
        const response = await api.get('/submissions');
        return response.data;
    },

    getSubmissionById: async (id) => {
        const response = await api.get(`/submissions/${id}`);
        return response.data;
    },

    createSubmission: async (submissionData) => {
        const response = await api.post('/submissions', submissionData);
        return response.data;
    },

    updateSubmission: async (id, submissionData) => {
        const response = await api.put(`/submissions/${id}`, submissionData);
        return response.data;
    },

    deleteSubmission: async (id) => {
        await api.delete(`/submissions/${id}`);
    },

    getSubmissionsByStatus: async (status) => {
        const response = await api.get(`/submissions/by-status/${status}`);
        return response.data;
    },

    // FIX: Kirim status sebagai query parameter, bukan JSON body
    updateSubmissionStatus: async (id, status) => {
        const response = await api.put(`/submissions/${id}/status?status=${status}`);
        return response.data;
    }
};