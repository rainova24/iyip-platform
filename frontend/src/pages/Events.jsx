import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';
import { eventService } from '../services/event';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [filter, setFilter] = useState('all'); // all, upcoming, my-events
    const { user } = useAuth();

    useEffect(() => {
        loadEvents();
    }, [filter]);

    const loadEvents = async () => {
        try {
            setLoading(true);
            let data;
            switch (filter) {
                case 'upcoming':
                    data = await eventService.getUpcomingEvents();
                    break;
                case 'my-events':
                    if (user) {
                        data = await eventService.getUserEvents();
                    } else {
                        data = [];
                    }
                    break;
                default:
                    data = await eventService.getAllEvents();
            }
            setEvents(data);
        } catch (error) {
            setAlert({ message: 'Failed to load events', type: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await eventService.registerForEvent(eventId);
            setAlert({ message: 'Successfully registered for event!', type: 'success' });
            loadEvents();
        } catch (error) {
            setAlert({ message: 'Failed to register for event', type: 'danger' });
        }
    };

    const handleUnregister = async (eventId) => {
        try {
            await eventService.unregisterFromEvent(eventId);
            setAlert({ message: 'Successfully unregistered from event', type: 'success' });
            loadEvents();
        } catch (error) {
            setAlert({ message: 'Failed to unregister from event', type: 'danger' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
            <Header />

            <div className="container">
                {alert && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}

                <div className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h1 className="panel-header">Events</h1>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                            >
                                <option value="all">All Events</option>
                                <option value="upcoming">Upcoming Events</option>
                                {user && <option value="my-events">My Events</option>}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>Loading events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p>No events found.</p>
                        </div>
                    ) : (
                        <div className="events-grid">
                            {events.map(event => (
                                <div key={event.eventId} className="event-card">
                                    <div className="event-header">
                                        <h3>{event.title}</h3>
                                        <span className="event-date">
                                            {formatDate(event.startDate)}
                                            {event.startDate !== event.endDate &&
                                                ` - ${formatDate(event.endDate)}`
                                            }
                                        </span>
                                    </div>

                                    <div className="event-content">
                                        <p>{event.description || 'No description available.'}</p>

                                        <div className="event-info">
                                            {event.registrationDeadline && (
                                                <p><strong>Registration Deadline:</strong> {formatDate(event.registrationDeadline)}</p>
                                            )}
                                            <p><strong>Total Registrations:</strong> {event.totalRegistrations || 0}</p>
                                        </div>
                                    </div>

                                    <div className="event-actions">
                                        <Link to={`/events/${event.eventId}`} className="btn btn-secondary">
                                            View Details
                                        </Link>

                                        {user && (
                                            <div style={{ marginLeft: '10px' }}>
                                                {event.isRegistered ? (
                                                    <button
                                                        onClick={() => handleUnregister(event.eventId)}
                                                        className="btn btn-danger"
                                                    >
                                                        Unregister
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRegister(event.eventId)}
                                                        className="btn btn-primary"
                                                    >
                                                        Register
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Events;