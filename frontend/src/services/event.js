import api from './api';

export const eventService = {
    getAllEvents: async () => {
        const response = await api.get('/events');
        return response.data;
    },

    getUpcomingEvents: async () => {
        const response = await api.get('/events/upcoming');
        return response.data;
    },

    getUserEvents: async () => {
        const response = await api.get('/events/my-events');
        return response.data;
    },

    getEventById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    createEvent: async (eventData) => {
        const response = await api.post('/events', eventData);
        return response.data;
    },

    updateEvent: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    deleteEvent: async (id) => {
        await api.delete(`/events/${id}`);
    },

    registerForEvent: async (id) => {
        await api.post(`/events/${id}/register`);
    },

    unregisterFromEvent: async (id) => {
        await api.delete(`/events/${id}/unregister`);
    }
};