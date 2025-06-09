import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setAlert({
                message: 'Login failed. Please check your credentials.',
                type: 'danger'
            });
        } finally {
            setLoading(false);
        }
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

                <div className="panel" style={{ maxWidth: '500px', margin: '50px auto' }}>
                    <h1 className="panel-header">Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p style={{ marginTop: '20px' }}>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;