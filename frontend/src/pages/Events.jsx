// File: frontend/src/pages/Events.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const Events = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Track which event is being processed
    const [filter, setFilter] = useState('all'); // all, upcoming, registered
    const [alert, setAlert] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadEvents();
    }, [user]); // Reload when user changes

    const loadEvents = async () => {
        try {
            setLoading(true);
            console.log('Loading events from API...');

            // Load all events
            const allEventsResponse = await authService.getEvents();
            console.log('Events API Response:', allEventsResponse);

            // Load registered events if user is logged in
            let myEventsResponse = { data: { success: true, data: [] } };
            if (user) {
                try {
                    myEventsResponse = await authService.getMyEvents();
                    console.log('My Events API Response:', myEventsResponse);
                } catch (error) {
                    console.log('No registered events or API error:', error);
                }
            }

            // Extract events data from response
            let eventsData = [];
            if (allEventsResponse.data) {
                if (allEventsResponse.data.success && Array.isArray(allEventsResponse.data.data)) {
                    eventsData = allEventsResponse.data.data;
                } else if (Array.isArray(allEventsResponse.data)) {
                    eventsData = allEventsResponse.data;
                }
            }

            // Extract registered events data
            let myEventsData = [];
            if (myEventsResponse.data) {
                if (myEventsResponse.data.success && Array.isArray(myEventsResponse.data.data)) {
                    myEventsData = myEventsResponse.data.data;
                } else if (Array.isArray(myEventsResponse.data)) {
                    myEventsData = myEventsResponse.data;
                }
            }

            setEvents(eventsData);
            setRegisteredEvents(myEventsData);

            console.log('Set events:', eventsData);
            console.log('Set registered events:', myEventsData);

        } catch (error) {
            console.error('Error loading events:', error);
            setAlert({
                type: 'error',
                message: 'Failed to load events from server. Please check your connection.'
            });

            // Set empty arrays to prevent crashes
            setEvents([]);
            setRegisteredEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            setAlert({ type: 'error', message: 'Please login first.' });
            return;
        }

        try {
            setActionLoading(eventId);
            console.log('Registering for event:', eventId);

            await authService.registerForEvent(eventId);

            setAlert({ type: 'success', message: 'Successfully registered for the event!' });

            // Update local state immediately for better UX
            const registeredEvent = events.find(e => e.eventId === eventId);
            if (registeredEvent) {
                setRegisteredEvents(prev => [...prev, registeredEvent]);
            }

            // Then reload from server to ensure consistency
            setTimeout(() => {
                loadEvents();
            }, 1000);

        } catch (error) {
            console.error('Error registering for event:', error);

            let errorMessage = 'Failed to register for event. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Please login first.';
            } else if (error.response?.status === 409) {
                errorMessage = 'You are already registered for this event.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Registration deadline has passed or event is not available.';
            }

            setAlert({ type: 'error', message: errorMessage });
        } finally {
            setActionLoading(null);
        }
    };

    const handleUnregister = async (eventId) => {
        if (!user) {
            setAlert({ type: 'error', message: 'Please login first.' });
            return;
        }

        try {
            setActionLoading(eventId);
            console.log('Unregistering from event:', eventId);

            await authService.unregisterFromEvent(eventId);

            setAlert({ type: 'success', message: 'Successfully unregistered from the event!' });

            // Update local state immediately for better UX
            setRegisteredEvents(prev => prev.filter(e => e.eventId !== eventId));

            // Then reload from server to ensure consistency
            setTimeout(() => {
                loadEvents();
            }, 1000);

        } catch (error) {
            console.error('Error unregistering from event:', error);

            let errorMessage = 'Failed to unregister from event. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Please login first.';
            } else if (error.response?.status === 404) {
                errorMessage = 'You are not registered for this event.';
            }

            setAlert({ type: 'error', message: errorMessage });
        } finally {
            setActionLoading(null);
        }
    };

    // Helper functions
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isUpcoming = (dateString) => {
        return new Date(dateString) > new Date();
    };

    const isRegistered = (eventId) => {
        return Array.isArray(registeredEvents) && registeredEvents.some(event => event.eventId === eventId);
    };

    const getEventStatus = (event) => {
        const now = new Date();
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        const regDeadline = new Date(event.registrationDeadline);

        if (now > endDate) return 'completed';
        if (now >= startDate && now <= endDate) return 'ongoing';
        if (now > regDeadline) return 'registration-closed';
        return 'upcoming';
    };

    // Filter and search events safely
    const getFilteredEvents = () => {
        if (!Array.isArray(events)) {
            console.warn('Events is not an array:', events);
            return [];
        }

        let filtered = events;

        // Apply filter
        switch (filter) {
            case 'upcoming':
                filtered = events.filter(event => isUpcoming(event.startDate));
                break;
            case 'registered':
                filtered = events.filter(event => isRegistered(event.eventId));
                break;
            default:
                filtered = events;
        }

        // Apply search
        if (searchTerm.trim()) {
            filtered = filtered.filter(event =>
                event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredEvents = getFilteredEvents();

    // Auto-hide alerts after 5 seconds
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    if (loading) {
        return (
            <div className="events-page">
                <div className="events-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading events...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="events-page">
            <div className="events-container">
                {/* Header */}
                <div className="events-header">
                    <div className="header-content">
                        <h1>Events</h1>
                        <p>Discover and join exciting events, workshops, and conferences</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-number">{events.length}</span>
                            <span className="stat-label">Total Events</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{events.filter(e => isUpcoming(e.startDate)).length}</span>
                            <span className="stat-label">Upcoming</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{registeredEvents.length}</span>
                            <span className="stat-label">Registered</span>
                        </div>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type}`}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
                        <span>{alert.message}</span>
                        <button
                            className="alert-close"
                            onClick={() => setAlert(null)}
                            aria-label="Close alert"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="events-controls">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Events ({events.length})
                        </button>
                        <button
                            className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setFilter('upcoming')}
                        >
                            Upcoming ({events.filter(e => isUpcoming(e.startDate)).length})
                        </button>
                        <button
                            className={`filter-tab ${filter === 'registered' ? 'active' : ''}`}
                            onClick={() => setFilter('registered')}
                        >
                            My Events ({registeredEvents.length})
                        </button>
                    </div>

                    <div className="search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Events Grid */}
                <div className="events-grid">
                    {filteredEvents.length === 0 ? (
                        <div className="no-events">
                            <i className="fas fa-calendar-times"></i>
                            <h3>No events found</h3>
                            <p>
                                {searchTerm
                                    ? `No events match your search "${searchTerm}"`
                                    : filter === 'registered'
                                        ? "You haven't registered for any events yet."
                                        : "No events available at the moment."
                                }
                            </p>
                        </div>
                    ) : (
                        filteredEvents.map((event) => {
                            const status = getEventStatus(event);
                            const registered = isRegistered(event.eventId);
                            const isProcessing = actionLoading === event.eventId;

                            return (
                                <div key={event.eventId} className={`event-card ${status}`}>
                                    <div className="event-card-header">
                                        <div className="event-badges">
                                            <span className={`event-status ${status}`}>
                                                {status === 'upcoming' && <i className="fas fa-clock"></i>}
                                                {status === 'ongoing' && <i className="fas fa-play-circle"></i>}
                                                {status === 'completed' && <i className="fas fa-check-circle"></i>}
                                                {status === 'registration-closed' && <i className="fas fa-lock"></i>}
                                                {status.replace('-', ' ')}
                                            </span>
                                            {registered && (
                                                <span className="registered-badge">
                                                    <i className="fas fa-check-circle"></i>
                                                    Registered
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="event-title">{event.title}</h3>
                                        <p className="event-description">{event.description}</p>
                                    </div>

                                    <div className="event-card-body">
                                        <div className="event-details">
                                            <div className="detail-item">
                                                <i className="fas fa-calendar-start"></i>
                                                <span>Start: {formatDate(event.startDate)}</span>
                                            </div>
                                            <div className="detail-item">
                                                <i className="fas fa-calendar-end"></i>
                                                <span>End: {formatDate(event.endDate)}</span>
                                            </div>
                                            {status === 'upcoming' && (
                                                <div className="detail-item">
                                                    <i className="fas fa-clock"></i>
                                                    <span>Registration Deadline: {formatDate(event.registrationDeadline)}</span>
                                                </div>
                                            )}
                                            <div className="detail-item">
                                                <i className="fas fa-users"></i>
                                                <span>{event.totalRegistrations || 0} registered</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="event-card-actions">
                                        <Link
                                            to={`/events/${event.eventId}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <i className="fas fa-eye"></i>
                                            View Details
                                        </Link>

                                        {user && status === 'upcoming' ? (
                                            <>
                                                {registered ? (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleUnregister(event.eventId)}
                                                        disabled={isProcessing}
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                                Unregistering...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-times"></i>
                                                                Unregister
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleRegister(event.eventId)}
                                                        disabled={isProcessing}
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                                Registering...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-plus"></i>
                                                                Register
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        ) : !user ? (
                                            <Link
                                                to="/login"
                                                className="btn btn-primary btn-sm"
                                            >
                                                <i className="fas fa-sign-in-alt"></i>
                                                Login to Register
                                            </Link>
                                        ) : (
                                            <button
                                                className="btn btn-disabled btn-sm"
                                                disabled
                                            >
                                                <i className="fas fa-ban"></i>
                                                Registration Closed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;