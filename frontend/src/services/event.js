// frontend/src/services/event.js
import api from './api';

export const eventService = {
    getAllEvents: async () => {
        try {
            const response = await api.get('/events');

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data || []
                };
            }

            return response;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    getUpcomingEvents: async () => {
        try {
            // Since backend doesn't have specific upcoming endpoint,
            // we get all events and filter on frontend
            const response = await eventService.getAllEvents();
            return response;
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            throw error;
        }
    },

    getUserEvents: async () => {
        try {
            // Backend endpoint would be /events/my-events but requires authentication
            // For now, return empty array
            return {
                data: { success: true, data: [] }
            };
        } catch (error) {
            console.error('Error fetching user events:', error);
            throw error;
        }
    },

    getEventById: async (id) => {
        try {
            const response = await api.get(`/events/${id}`);

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data
                };
            }

            return response;
        } catch (error) {
            console.error(`Error fetching event ${id}:`, error);
            throw error;
        }
    },

    createEvent: async (eventData) => {
        try {
            const response = await api.post('/events', eventData);

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data
                };
            }

            return response;
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        }
    },

    updateEvent: async (id, eventData) => {
        try {
            const response = await api.put(`/events/${id}`, eventData);

            // Handle backend ApiResponse format
            if (response.data && response.data.success) {
                return {
                    ...response,
                    data: response.data.data
                };
            }

            return response;
        } catch (error) {
            console.error(`Error updating event ${id}:`, error);
            throw error;
        }
    },

    deleteEvent: async (id) => {
        try {
            const response = await api.delete(`/events/${id}`);
            return response;
        } catch (error) {
            console.error(`Error deleting event ${id}:`, error);
            throw error;
        }
    },

    registerForEvent: async (id) => {
        try {
            const response = await api.post(`/events/${id}/register`);
            return response;
        } catch (error) {
            console.error(`Error registering for event ${id}:`, error);
            throw error;
        }
    },

    unregisterFromEvent: async (id) => {
        try {
            const response = await api.delete(`/events/${id}/register`);
            return response;
        } catch (error) {
            console.error(`Error unregistering from event ${id}:`, error);
            throw error;
        }
    }
};