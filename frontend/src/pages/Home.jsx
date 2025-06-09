import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const Home = () => {
    return (
        <div>
            <Header />

            <div className="container">
                <div className="panel">
                    <h1 className="panel-header">Welcome to IYIP Platform</h1>
                    <p>IYIP Platform is a comprehensive solution for managing transactions and user data.</p>
                    <p>Our platform provides the following features:</p>
                    <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                        <li>User authentication and authorization</li>
                        <li>Transaction management</li>
                        <li>Secure data storage</li>
                        <li>User-friendly interface</li>
                    </ul>
                    <div style={{ marginTop: '20px' }}>
                        <Link to="/login" className="btn">Login</Link>
                        <Link to="/register" className="btn btn-secondary" style={{ marginLeft: '10px' }}>
                            Register
                        </Link>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-header">API Endpoints</h2>
                    <p>This platform also provides a REST API for developers:</p>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Authentication Endpoints</h3>
                        <div className="endpoint-box">POST /api/auth/login</div>
                        <div className="endpoint-box">POST /api/auth/register</div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Public Endpoints</h3>
                        <div className="endpoint-box">GET /api/public/**</div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Protected Endpoints</h3>
                        <div className="endpoint-box">GET /api/transactions</div>
                        <div className="endpoint-box">GET /api/transactions/{'{id}'}</div>
                        <div className="endpoint-box">GET /api/transactions/user</div>
                        <div className="endpoint-box">POST /api/transactions</div>
                        <div className="endpoint-box">PUT /api/transactions/{'{id}'}</div>
                        <div className="endpoint-box">DELETE /api/transactions/{'{id}'}</div>
                    </div>

                    <p style={{ marginTop: '20px' }}>
                        To use protected endpoints, you need to authenticate first and include the JWT token in the Authorization header.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;