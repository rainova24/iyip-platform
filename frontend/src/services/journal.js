import api from './api';

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