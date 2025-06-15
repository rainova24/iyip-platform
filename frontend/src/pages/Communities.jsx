// frontend/src/pages/Communities.jsx - CLEAN VERSION
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const Communities = () => {
    const { user } = useAuth();
    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState('all');
    const [alert, setAlert] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadCommunities();
    }, []);

    const loadCommunities = async () => {
        try {
            setLoading(true);
            console.log('Loading communities from API...');

            const [allCommunitiesResponse, myCommunitiesResponse] = await Promise.all([
                authService.getCommunities().catch(() => ({ data: { success: false, data: [] } })),
                user ? authService.getMyCommunities().catch(() => ({ data: { success: false, data: [] } })) : Promise.resolve({ data: { success: true, data: [] } })
            ]);

            let communitiesData = [];
            let myCommunitiesData = [];

            if (allCommunitiesResponse.data) {
                if (allCommunitiesResponse.data.success && Array.isArray(allCommunitiesResponse.data.data)) {
                    communitiesData = allCommunitiesResponse.data.data;
                } else if (Array.isArray(allCommunitiesResponse.data)) {
                    communitiesData = allCommunitiesResponse.data;
                }
            }

            if (myCommunitiesResponse.data) {
                if (myCommunitiesResponse.data.success && Array.isArray(myCommunitiesResponse.data.data)) {
                    myCommunitiesData = myCommunitiesResponse.data.data;
                } else if (Array.isArray(myCommunitiesResponse.data)) {
                    myCommunitiesData = myCommunitiesResponse.data;
                }
            }

            setCommunities(communitiesData);
            setMyCommunities(myCommunitiesData);

        } catch (error) {
            console.error('Error loading communities:', error);
            setAlert({
                type: 'error',
                message: 'Failed to load communities from server. Please check your connection.'
            });
            setCommunities([]);
            setMyCommunities([]);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinCommunity = async (communityId) => {
        if (!user) {
            setAlert({ type: 'error', message: 'Please login to join communities.' });
            return;
        }

        try {
            setActionLoading(communityId);
            await authService.joinCommunity(communityId);
            setAlert({ type: 'success', message: 'Successfully joined the community!' });
            await loadCommunities();
        } catch (error) {
            console.error('Error joining community:', error);
            let errorMessage = 'Failed to join community. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Please login to join communities.';
            } else if (error.response?.status === 409) {
                errorMessage = 'You are already a member of this community.';
            }
            setAlert({ type: 'error', message: errorMessage });
        } finally {
            setActionLoading(null);
        }
    };

    const handleLeaveCommunity = async (communityId) => {
        if (!user) {
            setAlert({ type: 'error', message: 'Please login first.' });
            return;
        }

        try {
            setActionLoading(communityId);
            await authService.leaveCommunity(communityId);
            setAlert({ type: 'success', message: 'Successfully left the community!' });
            await loadCommunities();
        } catch (error) {
            console.error('Error leaving community:', error);
            let errorMessage = 'Failed to leave community. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            setAlert({ type: 'error', message: errorMessage });
        } finally {
            setActionLoading(null);
        }
    };

    const isJoined = (communityId) => {
        return Array.isArray(myCommunities) && myCommunities.some(community => community.communityId === communityId);
    };

    const getFilteredCommunities = () => {
        if (!Array.isArray(communities)) {
            return [];
        }

        let filtered = communities;

        switch (filter) {
            case 'joined':
                filtered = communities.filter(community => isJoined(community.communityId));
                break;
            case 'available':
                filtered = communities.filter(community => !isJoined(community.communityId));
                break;
            default:
                filtered = communities;
        }

        if (searchTerm.trim()) {
            filtered = filtered.filter(community =>
                community.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                community.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredCommunities = getFilteredCommunities();

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
            <div className="communities-page">
                <div className="communities-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading communities...</p>
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
                        <p>Connect with like-minded individuals and grow your network</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-number">{communities.length}</span>
                            <span className="stat-label">Total Communities</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{myCommunities.length}</span>
                            <span className="stat-label">Joined</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">{Math.max(0, communities.length - myCommunities.length)}</span>
                            <span className="stat-label">Available</span>
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
                            Discover ({Math.max(0, communities.length - myCommunities.length)})
                        </button>
                    </div>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search communities..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Communities Grid */}
                <div className="communities-grid">
                    {filteredCommunities.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <h3>No communities found</h3>
                            <p>
                                {searchTerm ? (
                                    `No communities match "${searchTerm}". Try a different search term.`
                                ) : filter === 'joined' ? (
                                    "You haven't joined any communities yet. Discover communities to join!"
                                ) : filter === 'available' ? (
                                    "No available communities to join at the moment."
                                ) : (
                                    "No communities available. This might be due to a connection issue."
                                )}
                            </p>
                        </div>
                    ) : (
                        filteredCommunities.map((community) => {
                            const joined = isJoined(community.communityId);
                            const isProcessing = actionLoading === community.communityId;

                            return (
                                <div key={community.communityId} className={`community-card ${joined ? 'joined' : 'available'}`}>
                                    <div className="community-card-header">
                                        <div className="community-status">
                                            {joined && (
                                                <span className="joined-badge">
                                                    <i className="fas fa-check-circle"></i>
                                                    Joined
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="community-title">{community.name}</h3>
                                        <p className="community-description">{community.description}</p>
                                    </div>

                                    <div className="community-card-body">
                                        <div className="community-stats">
                                            <div className="stat-item">
                                                <i className="fas fa-users"></i>
                                                <span>{community.memberCount || 0} members</span>
                                            </div>
                                            {joined && (
                                                <div className="stat-item">
                                                    <i className="fas fa-calendar"></i>
                                                    <span>Active member</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="community-card-actions">
                                        <Link
                                            to={`/communities/${community.communityId}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <i className="fas fa-eye"></i>
                                            View Details
                                        </Link>

                                        {user ? (
                                            <>
                                                {joined ? (
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleLeaveCommunity(community.communityId)}
                                                        disabled={isProcessing}
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                                Leaving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-times"></i>
                                                                Leave
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleJoinCommunity(community.communityId)}
                                                        disabled={isProcessing}
                                                    >
                                                        {isProcessing ? (
                                                            <>
                                                                <i className="fas fa-spinner fa-spin"></i>
                                                                Joining...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-plus"></i>
                                                                Join
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <Link
                                                to="/login"
                                                className="btn btn-primary btn-sm"
                                            >
                                                <i className="fas fa-sign-in-alt"></i>
                                                Login to Join
                                            </Link>
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