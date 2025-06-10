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
    const [filter, setFilter] = useState('all'); // all, upcoming, registered
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);

            // Load all events and registered events
            const [allEventsResponse, myEventsResponse] = await Promise.all([
                authService.getEvents().catch(() => ({ data: [] })),
                authService.getMyEvents().catch(() => ({ data: [] }))
            ]);

            setEvents(allEventsResponse.data || []);
            setRegisteredEvents(myEventsResponse.data || []);
        } catch (error) {
            console.error('Error loading events:', error);
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
                    title: "Creative Arts Workshop",
                    description: "Workshop series on various creative arts techniques",
                    startDate: "2025-07-20",
                    endDate: "2025-07-22",
                    registrationDeadline: "2025-07-10",
                    totalRegistrations: 0
                },
                {
                    eventId: 4,
                    title: "Student Leadership Forum",
                    description: "Forum for developing student leadership skills",
                    startDate: "2025-10-05",
                    endDate: "2025-10-06",
                    registrationDeadline: "2025-09-20",
                    totalRegistrations: 0
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await authService.registerForEvent(eventId);
            setAlert({ type: 'success', message: 'Successfully registered for event!' });
            loadEvents(); // Reload to update registration status
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to register for event. Please try again.' });
        }
    };

    const handleUnregister = async (eventId) => {
        try {
            await authService.unregisterFromEvent(eventId);
            setAlert({ type: 'success', message: 'Successfully unregistered from event!' });
            loadEvents(); // Reload to update registration status
        } catch (error) {
            setAlert({ type: 'error', message: 'Failed to unregister from event. Please try again.' });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isRegistered = (eventId) => {
        return registeredEvents.some(event => event.eventId === eventId);
    };

    const isUpcoming = (startDate) => {
        return new Date(startDate) > new Date();
    };

    const filteredEvents = events.filter(event => {
        switch (filter) {
            case 'upcoming':
                return isUpcoming(event.startDate);
            case 'registered':
                return isRegistered(event.eventId);
            default:
                return true;
        }
    });

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
                            All Events
                        </button>
                        <button
                            className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setFilter('upcoming')}
                        >
                            <i className="fas fa-clock"></i>
                            Upcoming
                        </button>
                        <button
                            className={`filter-tab ${filter === 'registered' ? 'active' : ''}`}
                            onClick={() => setFilter('registered')}
                        >
                            <i className="fas fa-check"></i>
                            My Events
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                <div className="events-grid">
                    {filteredEvents.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-calendar-times"></i>
                            </div>
                            <h3>No events found</h3>
                            <p>
                                {filter === 'registered'
                                    ? "You haven't registered for any events yet."
                                    : filter === 'upcoming'
                                        ? "No upcoming events at the moment."
                                        : "No events available."
                                }
                            </p>
                        </div>
                    ) : (
                        filteredEvents.map(event => {
                            const status = getEventStatus(event);
                            const registered = isRegistered(event.eventId);

                            return (
                                <div key={event.eventId} className={`event-card ${status}`}>
                                    <div className="event-card-header">
                                        <div className="event-status-badge">
                                            {status === 'upcoming' && <span className="badge badge-primary">Upcoming</span>}
                                            {status === 'ongoing' && <span className="badge badge-success">Ongoing</span>}
                                            {status === 'completed' && <span className="badge badge-secondary">Completed</span>}
                                            {status === 'registration-closed' && <span className="badge badge-warning">Registration Closed</span>}
                                        </div>
                                        {registered && (
                                            <div className="registered-indicator">
                                                <i className="fas fa-check-circle"></i>
                                                Registered
                                            </div>
                                        )}
                                    </div>

                                    <div className="event-card-content">
                                        <h3 className="event-title">{event.title}</h3>
                                        <p className="event-description">{event.description}</p>

                                        <div className="event-details">
                                            <div className="detail-item">
                                                <i className="fas fa-calendar-alt"></i>
                                                <span>
                                                    {formatDate(event.startDate)}
                                                    {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                                                </span>
                                            </div>
                                            {event.registrationDeadline && (
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

                                        {user && status === 'upcoming' && (
                                            <>
                                                {registered ? (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleUnregister(event.eventId)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                        Unregister
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleRegister(event.eventId)}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                        Register
                                                    </button>
                                                )}
                                            </>
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