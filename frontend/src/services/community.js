// frontend/src/services/community.js
import api from './api';

export const communityService = {
    getAllCommunities: async () => {
        try {
            const response = await api.get('/communities');

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data || []
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching communities:', error);
            throw error;
        }
    },

    getUserCommunities: async () => {
        try {
            const response = await api.get('/communities/my-communities');

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data || []
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching user communities:', error);
            // Return empty array if user not authenticated
            return {
                data: { success: true, data: [] }
            };
        }
    },

    getCommunityById: async (id) => {
        try {
            const response = await api.get(`/communities/${id}`);

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data
                };
            }

            return response;
        } catch (error) {
            console.error(`Error fetching community ${id}:`, error);
            throw error;
        }
    },

    getCommunityMembers: async (id) => {
        try {
            const response = await api.get(`/communities/${id}/members`);

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data || []
                };
            }

            return response;
        } catch (error) {
            console.error(`Error fetching community ${id} members:`, error);
            throw error;
        }
    },

    createCommunity: async (communityData) => {
        try {
            const response = await api.post('/communities', communityData);

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data
                };
            }

            return response;
        } catch (error) {
            console.error('Error creating community:', error);
            throw error;
        }
    },

    updateCommunity: async (id, communityData) => {
        try {
            const response = await api.put(`/communities/${id}`, communityData);

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data
                };
            }

            return response;
        } catch (error) {
            console.error(`Error updating community ${id}:`, error);
            throw error;
        }
    },

    deleteCommunity: async (id) => {
        try {
            const response = await api.delete(`/communities/${id}`);
            return response;
        } catch (error) {
            console.error(`Error deleting community ${id}:`, error);
            throw error;
        }
    },

    joinCommunity: async (id) => {
        try {
            const response = await api.post(`/communities/${id}/join`);
            return response;
        } catch (error) {
            console.error(`Error joining community ${id}:`, error);
            throw error;
        }
    },

    leaveCommunity: async (id) => {
        try {
            const response = await api.delete(`/communities/${id}/leave`);
            return response;
        } catch (error) {
            console.error(`Error leaving community ${id}:`, error);
            throw error;
        }
    }
};