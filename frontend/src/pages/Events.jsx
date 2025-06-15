// frontend/src/pages/Events.jsx
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
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            console.log('Loading events from API...');

            // Load all events and registered events
            const [allEventsResponse, myEventsResponse] = await Promise.all([
                authService.getEvents().catch(() => ({ data: { success: false, data: [] } })),
                user ? authService.getMyEvents().catch(() => ({ data: { success: false, data: [] } })) : Promise.resolve({ data: { success: true, data: [] } })
            ]);

            console.log('Events API Response:', allEventsResponse);
            console.log('My Events API Response:', myEventsResponse);

            // Handle backend ApiResponse format: { success: true, message: "...", data: [...] }
            let eventsData = [];
            let myEventsData = [];

            // Extract events data from response
            if (allEventsResponse.data) {
                if (allEventsResponse.data.success && Array.isArray(allEventsResponse.data.data)) {
                    eventsData = allEventsResponse.data.data;
                } else if (Array.isArray(allEventsResponse.data)) {
                    eventsData = allEventsResponse.data;
                }
            }

            // Extract my events data from response
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

            // Show error alert
            setAlert({
                type: 'error',
                message: 'Failed to load events from server. Please check your connection.'
            });

            // Use demo data if API fails
            setEvents([
                {
                    eventId: 1,
                    title: "Tech Innovation Summit 2025",
                    description: "Annual technology innovation summit featuring latest trends and technologies",
                    startDate: "2025-08-15",
                    endDate: "2025-08-17",
                    registrationDeadline: "2025-08-01",
                    totalRegistrations: 2
                },
                {
                    eventId: 2,
                    title: "Academic Research Conference",
                    description: "International conference on academic research methodologies",
                    startDate: "2025-09-10",
                    endDate: "2025-09-12",
                    registrationDeadline: "2025-08-25",
                    totalRegistrations: 1
                },
                {
                    eventId: 3,
                    title: "Innovation Workshop",
                    description: "Hands-on workshop for innovation and entrepreneurship",
                    startDate: "2025-07-20",
                    endDate: "2025-07-21",
                    registrationDeadline: "2025-07-10",
                    totalRegistrations: 5
                }
            ]);
            setRegisteredEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            setAlert({ type: 'error', message: 'Please login to register for events.' });
            return;
        }

        try {
            setActionLoading(eventId);
            console.log('Registering for event:', eventId);

            await authService.registerForEvent(eventId);

            setAlert({ type: 'success', message: 'Successfully registered for the event!' });

            // Reload data to reflect changes
            await loadEvents();

        } catch (error) {
            console.error('Error registering for event:', error);

            let errorMessage = 'Failed to register for event. Please try again.';

            // Handle specific error messages
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Please login to register for events.';
            } else if (error.response?.status === 409) {
                errorMessage = 'You are already registered for this event.';
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

            // Reload data to reflect changes
            await loadEvents();

        } catch (error) {
            console.error('Error unregistering from event:', error);

            let errorMessage = 'Failed to unregister from event. Please try again.';

            // Handle specific error messages
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
                        {alert.message}
                        <button className="alert-close" onClick={() => setAlert(null)}>×</button>
                    </div>
                )}

                {/* Filters */}
                <div className="events-filters">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <i className="fas fa-calendar"></i>
                            All Events ({events.length})
                        </button>
                        <button
                            className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setFilter('upcoming')}
                        >
                            <i className="fas fa-clock"></i>
                            Upcoming ({events.filter(e => isUpcoming(e.startDate)).length})
                        </button>
                        <button
                            className={`filter-tab ${filter === 'registered' ? 'active' : ''}`}
                            onClick={() => setFilter('registered')}
                        >
                            <i className="fas fa-check-circle"></i>
                            My Events ({registeredEvents.length})
                        </button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="events-grid">
                    {filteredEvents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-calendar"></i>
                            </div>
                            <h3>No events found</h3>
                            <p>
                                {searchTerm ? (
                                    `No events match "${searchTerm}". Try a different search term.`
                                ) : filter === 'registered' ? (
                                    "You haven't registered for any events yet. Discover events to join!"
                                ) : filter === 'upcoming' ? (
                                    "No upcoming events available at the moment."
                                ) : (
                                    "No events available. This might be due to a connection issue."
                                )}
                            </p>
                            {filter === 'registered' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setFilter('upcoming')}
                                >
                                    <i className="fas fa-search"></i>
                                    Discover Events
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredEvents.map((event) => {
                            const status = getEventStatus(event);
                            const registered = isRegistered(event.eventId);
                            const isProcessing = actionLoading === event.eventId;

                            return (
                                <div key={event.eventId} className={`event-card ${status}`}>
                                    <div className="event-card-header">
                                        <div className="event-status">
                                            <span className={`status-badge ${status}`}>
                                                {status === 'upcoming' && <i className="fas fa-clock"></i>}
                                                {status === 'ongoing' && <i className="fas fa-play"></i>}
                                                {status === 'completed' && <i className="fas fa-check"></i>}
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
                                        ) : null}
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