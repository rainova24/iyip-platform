// frontend/src/pages/Communities.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const Communities = () => {
    const [communities, setCommunities] = useState([]);
    const [myCommunities, setMyCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const { user } = useAuth();

    useEffect(() => {
        loadCommunities();
    }, []);

    const loadCommunities = async () => {
        try {
            setLoading(true);
            const [allCommunitiesResponse, myCommunitiesResponse] = await Promise.all([
                authService.getCommunities(),
                authService.getMyCommunities()
            ]);
            setCommunities(allCommunitiesResponse.data);
            setMyCommunities(myCommunitiesResponse.data);
        } catch (error) {
            console.error('Error loading communities:', error);
            setError('Failed to load communities');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.createCommunity(formData);
            setShowForm(false);
            setFormData({
                name: '',
                description: ''
            });
            loadCommunities();
        } catch (error) {
            console.error('Error creating community:', error);
            setError('Failed to create community');
        }
    };

    const handleJoinCommunity = async (communityId) => {
        try {
            await authService.joinCommunity(communityId);
            loadCommunities();
        } catch (error) {
            console.error('Error joining community:', error);
            setError('Failed to join community');
        }
    };

    const handleLeaveCommunity = async (communityId) => {
        try {
            await authService.leaveCommunity(communityId);
            loadCommunities();
        } catch (error) {
            console.error('Error leaving community:', error);
            setError('Failed to leave community');
        }
    };

    const isUserInCommunity = (communityId) => {
        return myCommunities.some(community => community.communityId === communityId);
    };

    const getDisplayCommunities = () => {
        return activeTab === 'all' ? communities : myCommunities;
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Communities</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Create Community'}
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Create New Community</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Community Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Create Community
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Communities ({communities.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'my' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my')}
                    >
                        My Communities ({myCommunities.length})
                    </button>
                </li>
            </ul>

            <div className="row">
                {getDisplayCommunities().length === 0 ? (
                    <div className="col-12">
                        <div className="alert alert-info" role="alert">
                            {activeTab === 'all'
                                ? 'No communities available. Create the first one!'
                                : 'You haven\'t joined any communities yet. Join some communities to get started!'
                            }
                        </div>
                    </div>
                ) : (
                    getDisplayCommunities().map((community) => (
                        <div key={community.communityId} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{community.name}</h5>
                                    <p className="card-text">{community.description}</p>
                                </div>
                                <div className="card-footer">
                                    {activeTab === 'all' ? (
                                        isUserInCommunity(community.communityId) ? (
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleLeaveCommunity(community.communityId)}
                                            >
                                                Leave Community
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleJoinCommunity(community.communityId)}
                                            >
                                                Join Community
                                            </button>
                                        )
                                    ) : (
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                Joined: {new Date(community.joinedAt).toLocaleDateString()}
                                            </small>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleLeaveCommunity(community.communityId)}
                                            >
                                                Leave
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Communities;