// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalEvents: 0,
        totalJournals: 0,
        totalCommunities: 0
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Simulate loading stats
        const timer = setTimeout(() => {
            setStats({
                totalUsers: 1250,
                totalEvents: 45,
                totalJournals: 320,
                totalCommunities: 12
            });
            setIsVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: 'fa-calendar-alt',
            title: 'Event Management',
            description: 'Organize and participate in various academic and community events',
            color: 'var(--primary-orange)'
        },
        {
            icon: 'fa-book',
            title: 'Digital Journals',
            description: 'Create, share and manage your academic journals and research',
            color: 'var(--secondary-orange)'
        },
        {
            icon: 'fa-users',
            title: 'Communities',
            description: 'Join study groups and connect with like-minded students',
            color: 'var(--accent-orange)'
        },
        {
            icon: 'fa-upload',
            title: 'Submissions',
            description: 'Submit materials and facility requests with ease',
            color: 'var(--primary-orange)'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Computer Science Student',
            avatar: 'SJ',
            text: 'IYIP Platform has transformed how I manage my academic activities. The journal feature is incredibly useful!'
        },
        {
            name: 'Michael Chen',
            role: 'Engineering Student',
            avatar: 'MC',
            text: 'The event management system made organizing our tech conference so much easier. Highly recommended!'
        },
        {
            name: 'Emily Davis',
            role: 'Research Assistant',
            avatar: 'ED',
            text: 'Love the community features! I\'ve connected with amazing researchers and collaborators.'
        }
    ];

    const CountUpNumber = ({ end, duration = 2000 }) => {
        const [count, setCount] = useState(0);

        useEffect(() => {
            if (!isVisible) return;

            let startTime = null;
            const startValue = 0;

            const animate = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const currentCount = Math.floor(progress * (end - startValue) + startValue);
                
                setCount(currentCount);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }, [end, duration, isVisible]);

        return <span>{count.toLocaleString()}</span>;
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1 className="hero-title">
                            Welcome to <span style={{ color: 'var(--white)' }}>IYIP Platform</span>
                        </h1>
                        <p className="hero-subtitle">
                            Your comprehensive solution for academic event management, digital journals, 
                            community building, and seamless submissions. Join thousands of students 
                            and researchers in creating a better academic experience.
                        </p>
                        <div className="hero-buttons">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" className="btn btn-secondary" style={{
                                        background: 'var(--white)',
                                        color: 'var(--primary-orange)',
                                        fontSize: '1.2rem',
                                        padding: '1rem 2rem'
                                    }}>
                                        <i className="fas fa-chart-line"></i>
                                        Go to Dashboard
                                    </Link>
                                    <Link to="/events" className="btn btn-outline" style={{
                                        borderColor: 'var(--white)',
                                        color: 'var(--white)',
                                        fontSize: '1.2rem',
                                        padding: '1rem 2rem'
                                    }}>
                                        <i className="fas fa-calendar-alt"></i>
                                        Browse Events
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-secondary" style={{
                                        background: 'var(--white)',
                                        color: 'var(--primary-orange)',
                                        fontSize: '1.2rem',
                                        padding: '1rem 2rem'
                                    }}>
                                        <i className="fas fa-rocket"></i>
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="btn btn-outline" style={{
                                        borderColor: 'var(--white)',
                                        color: 'var(--white)',
                                        fontSize: '1.2rem',
                                        padding: '1rem 2rem'
                                    }}>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{
                padding: '6rem 0',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem'
                }}>

                    {/* Title */}
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        textAlign: 'center',
                        marginBottom: '1rem',
                        color: 'white'
                    }}>
                        Platform Statistics
                    </h2>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: '1.2rem',
                        textAlign: 'center',
                        marginBottom: '4rem',
                        color: 'rgba(255, 255, 255, 0.9)',
                        maxWidth: '600px',
                        margin: '0 auto 4rem'
                    }}>
                        Join our growing community of students, researchers, and academics
                    </p>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem',
                        marginTop: '3rem'
                    }}>

                        {/* Card 1 - Active Users */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                fontSize: '3.5rem',
                                fontWeight: '900',
                                color: 'white',
                                marginBottom: '1rem',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                                <CountUpNumber end={stats.totalUsers} />+
                            </div>
                            <div style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
                                Active Users
                            </div>
                        </div>

                        {/* Card 2 - Events Hosted */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                fontSize: '3.5rem',
                                fontWeight: '900',
                                color: 'white',
                                marginBottom: '1rem',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                                <CountUpNumber end={stats.totalEvents} />+
                            </div>
                            <div style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
                                Events Hosted
                            </div>
                        </div>

                        {/* Card 3 - Journals Created */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '16px',
                            padding: '3rem 2rem',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                fontSize: '3.5rem',
                                fontWeight: '900',
                                color: 'white',
                                marginBottom: '1rem',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                            }}>
                                <CountUpNumber end={stats.totalJournals} />+
                            </div>
                            <div style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                <i className="fas fa-book" style={{ marginRight: '0.5rem' }}></i>
                                Journals Created
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ 
                padding: '8rem 0', 
                background: 'var(--light-gray)'
            }}>
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '800',
                            color: 'var(--text-dark)',
                            marginBottom: '1rem'
                        }}>
                            Platform Features
                        </h2>
                        <p style={{ 
                            fontSize: '1.2rem', 
                            color: 'var(--text-light)',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            Discover all the powerful tools and features designed to enhance your academic journey
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '4rem'
                    }}>
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="card fade-in"
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                    textAlign: 'center',
                                    padding: '3rem 2rem',
                                    border: 'none',
                                    background: 'var(--white)'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2rem',
                                    fontSize: '2rem',
                                    color: 'var(--white)',
                                    boxShadow: `0 10px 30px ${feature.color}33`
                                }}>
                                    <i className={`fas ${feature.icon}`}></i>
                                </div>
                                <h3 className="card-title" style={{ 
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    marginBottom: '1rem'
                                }}>
                                    {feature.title}
                                </h3>
                                <p className="card-text" style={{ 
                                    fontSize: '1.1rem',
                                    lineHeight: '1.7'
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section style={{ 
                padding: '8rem 0', 
                background: 'var(--gradient-primary)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    animation: 'float 8s ease-in-out infinite'
                }}></div>
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '8%',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    animation: 'float 10s ease-in-out infinite reverse'
                }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="text-center mb-5">
                        <h2 style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '800',
                            color: 'var(--white)',
                            marginBottom: '1rem'
                        }}>
                            What Our Users Say
                        </h2>
                        <p style={{ 
                            fontSize: '1.2rem', 
                            color: 'rgba(255, 255, 255, 0.9)',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Hear from students and researchers who have transformed their academic experience
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                        gap: '2rem',
                        marginTop: '4rem'
                    }}>
                        {testimonials.map((testimonial, index) => (
                            <div 
                                key={index}
                                className="card fade-in"
                                style={{
                                    animationDelay: `${index * 0.3}s`,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: 'none',
                                    padding: '2.5rem'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'var(--gradient-primary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--white)',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        marginRight: '1rem'
                                    }}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h5 style={{ 
                                            margin: '0',
                                            fontWeight: '700',
                                            color: 'var(--text-dark)'
                                        }}>
                                            {testimonial.name}
                                        </h5>
                                        <p style={{ 
                                            margin: '0',
                                            color: 'var(--text-light)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <p style={{
                                    fontSize: '1.1rem',
                                    fontStyle: 'italic',
                                    color: 'var(--text-light)',
                                    lineHeight: '1.7',
                                    margin: '0'
                                }}>
                                    "{testimonial.text}"
                                </p>
                                <div style={{
                                    display: 'flex',
                                    color: 'var(--warning)',
                                    fontSize: '1.2rem',
                                    marginTop: '1rem'
                                }}>
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fas fa-star"></i>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ 
                padding: '6rem 0', 
                background: 'var(--white)',
                textAlign: 'center'
            }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ 
                            fontSize: '2.5rem', 
                            fontWeight: '800',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            marginBottom: '1.5rem'
                        }}>
                            Ready to Get Started?
                        </h2>
                        <p style={{ 
                            fontSize: '1.3rem', 
                            color: 'var(--text-light)',
                            marginBottom: '3rem',
                            lineHeight: '1.7'
                        }}>
                            Join thousands of students and researchers who are already using IYIP Platform 
                            to enhance their academic experience. Start your journey today!
                        </p>
                        
                        {!isAuthenticated && (
                            <div style={{
                                display: 'flex',
                                gap: '1.5rem',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <Link 
                                    to="/register" 
                                    className="btn btn-primary"
                                    style={{
                                        fontSize: '1.2rem',
                                        padding: '1.2rem 3rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="fas fa-rocket"></i>
                                    Create Free Account
                                </Link>
                                <Link 
                                    to="/login" 
                                    className="btn btn-outline"
                                    style={{
                                        fontSize: '1.2rem',
                                        padding: '1.2rem 3rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="fas fa-sign-in-alt"></i>
                                    Sign In Now
                                </Link>
                            </div>
                        )}

                        {isAuthenticated && (
                            <div style={{
                                background: 'var(--light-orange)',
                                borderRadius: 'var(--border-radius-lg)',
                                padding: '2rem',
                                border: '2px solid var(--accent-orange)'
                            }}>
                                <h4 style={{ 
                                    color: 'var(--primary-orange)',
                                    marginBottom: '1rem'
                                }}>
                                    Welcome back, {user?.name}! 👋
                                </h4>
                                <p style={{ 
                                    color: 'var(--text-light)',
                                    marginBottom: '1.5rem'
                                }}>
                                    Continue your academic journey with IYIP Platform
                                </p>
                                <Link 
                                    to="/dashboard" 
                                    className="btn btn-primary"
                                    style={{
                                        fontSize: '1.2rem',
                                        padding: '1rem 2.5rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="fas fa-chart-line"></i>
                                    Go to Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                background: 'var(--primary-dark)',
                color: 'var(--white)',
                padding: '3rem 0 2rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '3rem',
                        marginBottom: '2rem'
                    }}>
                        <div>
                            <h5 style={{ 
                                color: 'var(--white)',
                                marginBottom: '1rem',
                                fontSize: '1.3rem',
                                fontWeight: '700'
                            }}>
                                IYIP Platform
                            </h5>
                            <p style={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                lineHeight: '1.7'
                            }}>
                                Empowering students and researchers with comprehensive 
                                academic management tools.
                            </p>
                        </div>
                        <div>
                            <h6 style={{ 
                                color: 'var(--white)',
                                marginBottom: '1rem',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}>
                                Features
                            </h6>
                            <div style={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Event Management</a>
                                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Digital Journals</a>
                                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Communities</a>
                                <a href="#" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }}>Submissions</a>
                            </div>
                        </div>
                        <div>
                            <h6 style={{ 
                                color: 'var(--white)',
                                marginBottom: '1rem',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}>
                                Connect With Us
                            </h6>
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center'
                            }}>
                                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
                                    <a 
                                        key={index}
                                        href="#" 
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--white)',
                                            textDecoration: 'none',
                                            transition: 'var(--transition)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'var(--primary-orange)';
                                            e.target.style.transform = 'translateY(-3px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <i className={`fab fa-${social}`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                        paddingTop: '2rem'
                    }}>
                        <p style={{ 
                            color: 'rgba(255, 255, 255, 0.8)',
                            margin: '0',
                            fontSize: '0.9rem'
                        }}>
                            © 2024 IYIP Platform. All rights reserved. | Made with ❤️ for academic excellence
                        </p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                
                .slide-up {
                    animation: slideUp 0.8s ease-out both;
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;