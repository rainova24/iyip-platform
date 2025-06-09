import api from './api';

export const communityService = {
    getAllCommunities: async () => {
        const response = await api.get('/communities');
        return response.data;
    },

    getUserCommunities: async () => {
        const response = await api.get('/communities/my-communities');
        return response.data;
    },

    getCommunityById: async (id) => {
        const response = await api.get(`/communities/${id}`);
        return response.data;
    },

    createCommunity: async (communityData) => {
        const response = await api.post('/communities', communityData);
        return response.data;
    },

    updateCommunity: async (id, communityData) => {
        const response = await api.put(`/communities/${id}`, communityData);
        return response.data;
    },

    deleteCommunity: async (id) => {
        await api.delete(`/communities/${id}`);
    },

    joinCommunity: async (id) => {
        await api.post(`/communities/${id}/join`);
    },

    leaveCommunity: async (id) => {
        await api.delete(`/communities/${id}/leave`);
    }
};