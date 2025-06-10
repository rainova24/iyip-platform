// frontend/src/pages/Communities.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const Communities = () => {
    const { user } = useAuth();
    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, joined, available
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        loadCommunities();
    }, []);

    const loadCommunities = async () => {
        try {
            setLoading(true);
            console.log('Loading communities from API...');

            // Load all communities and my communities
            const [allCommunitiesResponse, myCommunitiesResponse] = await Promise.all([
                authService.getCommunities(),
                authService.getMyCommunities().catch(() => ({ data: [] }))
            ]);

            console.log('Communities API Response:', allCommunitiesResponse);
            console.log('My Communities API Response:', myCommunitiesResponse);

            // Set communities from API response
            const communitiesData = allCommunitiesResponse.data || allCommunitiesResponse || [];
            const myCommunitiesData = myCommunitiesResponse.data || myCommunitiesResponse || [];

            setCommunities(communitiesData);
            setMyCommunities(myCommunitiesData);

            console.log('Set communities:', communitiesData);
            console.log('Set my communities:', myCommunitiesData);
        } catch (error) {
            console.error('Error loading communities:', error);

            // Show error alert
            setAlert({
                type: 'error',
                message: 'Failed to load communities from server. Please check your connection.'
            });

            // Keep empty arrays to show empty state
            setCommunities([]);
            setMyCommunities([]);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCommunity = async (communityId) => {
        try {
            console.log('Joining community:', communityId);
            await authService.joinCommunity(communityId);
            setAlert({ type: 'success', message: 'Successfully joined the community!' });
            loadCommunities(); // Reload to update join status
        } catch (error) {
            console.error('Error joining community:', error);
            setAlert({ type: 'error', message: 'Failed to join community. Please try again.' });
        }
    };

    const handleLeaveCommunity = async (communityId) => {
        try {
            console.log('Leaving community:', communityId);
            await authService.leaveCommunity(communityId);
            setAlert({ type: 'success', message: 'Successfully left the community!' });
            loadCommunities(); // Reload to update join status
        } catch (error) {
            console.error('Error leaving community:', error);
            setAlert({ type: 'error', message: 'Failed to leave community. Please try again.' });
        }
    };

    const handleCreateCommunity = () => {
        // For now, show info message
        setAlert({ type: 'info', message: 'Create community functionality will be implemented soon!' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isJoined = (communityId) => {
        return myCommunities.some(community =>
            community.communityId === communityId || community.id === communityId
        );
    };

    const getCommunityIcon = (name) => {
        // Determine icon based on community name/category
        if (name?.toLowerCase().includes('technology') || name?.toLowerCase().includes('tech')) {
            return 'fas fa-laptop-code';
        } else if (name?.toLowerCase().includes('research') || name?.toLowerCase().includes('academic')) {
            return 'fas fa-microscope';
        } else if (name?.toLowerCase().includes('student') || name?.toLowerCase().includes('education')) {
            return 'fas fa-graduation-cap';
        } else if (name?.toLowerCase().includes('arts') || name?.toLowerCase().includes('creative')) {
            return 'fas fa-palette';
        } else {
            return 'fas fa-users';
        }
    };

    const filteredCommunities = communities.filter(community => {
        switch (filter) {
            case 'joined':
                return isJoined(community.communityId || community.id);
            case 'available':
                return !isJoined(community.communityId || community.id);
            default:
                return true;
        }
    });

    if (loading) {
        return (
            <div className="communities-page">
                <div className="communities-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading communities from database...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="communities-page">
            <div className="communities-container">
                {/* Header */}
                <div className="communities-header">
                    <div className="header-content">
                        <h1>Communities</h1>
                        <p>Connect with like-minded individuals and join vibrant communities</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-primary" onClick={handleCreateCommunity}>
                            <i className="fas fa-plus"></i>
                            Create Community
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="communities-stats">
                    <div className="stat-item">
                        <span className="stat-number">{communities.length}</span>
                        <span className="stat-label">Total Communities</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{myCommunities.length}</span>
                        <span className="stat-label">Joined</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {communities.reduce((sum, c) => sum + (c.memberCount || 0), 0)}
                        </span>
                        <span className="stat-label">Total Members</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{communities.filter(c => c.isActive !== false).length}</span>
                        <span className="stat-label">Active Communities</span>
                    </div>
                </div>

                {/* Alert */}
                {alert && (
                    <div className={`alert alert-${alert.type}`}>
                        <i className={`fas ${alert.type === 'success' ? 'fa-check-circle' : alert.type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                        {alert.message}
                        <button className="alert-close" onClick={() => setAlert(null)}>×</button>
                    </div>
                )}

                {/* Filters */}
                <div className="communities-filters">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            <i className="fas fa-users"></i>
                            All Communities ({communities.length})
                        </button>
                        <button
                            className={`filter-tab ${filter === 'joined' ? 'active' : ''}`}
                            onClick={() => setFilter('joined')}
                        >
                            <i className="fas fa-check-circle"></i>
                            My Communities ({myCommunities.length})
                        </button>
                        <button
                            className={`filter-tab ${filter === 'available' ? 'active' : ''}`}
                            onClick={() => setFilter('available')}
                        >
                            <i className="fas fa-search"></i>
                            Discover ({communities.length - myCommunities.length})
                        </button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search communities..."
                            className="search-input"
                        />
                        <button className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Debug Info - Remove this in production */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{
                        background: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        fontSize: '14px',
                        fontFamily: 'monospace'
                    }}>
                        <strong>Debug Info:</strong><br/>
                        Total Communities: {communities.length}<br/>
                        My Communities: {myCommunities.length}<br/>
                        Filtered Communities: {filteredCommunities.length}<br/>
                        API Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}
                    </div>
                )}

                {/* Communities Grid */}
                <div className="communities-grid">
                    {filteredCommunities.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>No communities found</h3>
                            <p>
                                {filter === 'joined'
                                    ? "You haven't joined any communities yet."
                                    : filter === 'available'
                                        ? "No available communities to join at the moment."
                                        : "No communities available. This might be due to a connection issue."
                                }
                            </p>
                            {filter !== 'joined' && (
                                <button className="btn btn-primary" onClick={handleCreateCommunity}>
                                    Create New Community
                                </button>
                            )}
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                                If you're seeing this, please check:
                                <br/>• Backend server is running on localhost:8080
                                <br/>• Database has community data
                                <br/>• Network connection is working
                            </p>
                        </div>
                    ) : (
                        filteredCommunities.map(community => {
                            const communityId = community.communityId || community.id;
                            const joined = isJoined(communityId);

                            return (
                                <div key={communityId} className={`community-card ${joined ? 'joined' : ''}`}>
                                    <div className="community-card-header">
                                        <div className="community-icon">
                                            <i className={getCommunityIcon(community.name)}></i>
                                        </div>
                                        <div className="community-badges">
                                            {joined && (
                                                <span className="badge badge-joined">
                                                    <i className="fas fa-check"></i>
                                                    Joined
                                                </span>
                                            )}
                                            <span className="badge badge-active">
                                                <i className="fas fa-circle"></i>
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="community-card-content">
                                        <h3 className="community-name">{community.name}</h3>
                                        <p className="community-description">
                                            {community.description || 'No description available.'}
                                        </p>

                                        <div className="community-stats">
                                            <div className="stat-item">
                                                <i className="fas fa-users"></i>
                                                <span>{community.memberCount || 0} members</span>
                                            </div>
                                            <div className="stat-item">
                                                <i className="fas fa-calendar"></i>
                                                <span>
                                                    Since {community.createdAt ? formatDate(community.createdAt) : 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="community-card-actions">
                                        <Link
                                            to={`/communities/${communityId}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <i className="fas fa-eye"></i>
                                            View Details
                                        </Link>

                                        {user && (
                                            <>
                                                {joined ? (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleLeaveCommunity(communityId)}
                                                    >
                                                        <i className="fas fa-sign-out-alt"></i>
                                                        Leave
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleJoinCommunity(communityId)}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                        Join
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

export default Communities;