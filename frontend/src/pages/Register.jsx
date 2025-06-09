import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/common/Alert';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
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
            await register(formData.name, formData.email, formData.password);
            setAlert({
                message: 'Registration successful! You can now login.',
                type: 'success'
            });

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setAlert({
                message: 'Registration failed. Please try again.',
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
                    <h1 className="panel-header">Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
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
                                minLength="6"
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                    <p style={{ marginTop: '20px' }}>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;