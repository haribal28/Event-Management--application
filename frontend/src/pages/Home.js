/**
 * Home Page
 * 
 * Landing page with premium animations:
 * - Hero section with parallax and floating elements
 * - Event grid with staggered animations
 * - Feature highlights
 */

import { motion } from 'framer-motion';
import Hero from '../components/sections/Hero';
import EventGrid from '../components/sections/EventGrid';
import { AnimatedPage } from '../components/animations/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import { FiZap, FiShield, FiGlobe, FiArrowRight } from 'react-icons/fi';
import './Home.css';

// Sample events data
const sampleEvents = [
    {
        id: 1,
        title: 'Tech Innovation Summit 2026',
        description: 'Join industry leaders for a day of insights into the future of technology and innovation.',
        date: '2026-03-15',
        location: 'San Francisco, CA',
        category: 'Technology',
        price: 299,
        attendees: 2500,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    },
    {
        id: 2,
        title: 'Sunset Music Festival',
        description: 'Experience three days of incredible live music performances from world-class artists.',
        date: '2026-04-20',
        location: 'Los Angeles, CA',
        category: 'Music',
        price: 150,
        attendees: 15000,
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    },
    {
        id: 3,
        title: 'Startup Pitch Competition',
        description: 'Watch innovative startups compete for funding and mentorship opportunities.',
        date: '2026-03-28',
        location: 'New York, NY',
        category: 'Business',
        price: 0,
        attendees: 500,
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    },
    {
        id: 4,
        title: 'Art & Design Expo',
        description: 'Explore contemporary art installations and connect with creative minds from around the world.',
        date: '2026-05-10',
        location: 'Chicago, IL',
        category: 'Arts',
        price: 45,
        attendees: 3000,
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800',
    },
    {
        id: 5,
        title: 'Marathon Championship',
        description: 'Join thousands of runners in this prestigious annual marathon event.',
        date: '2026-04-05',
        location: 'Boston, MA',
        category: 'Sports',
        price: 75,
        attendees: 30000,
        image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    },
    {
        id: 6,
        title: 'AI & Machine Learning Conference',
        description: 'Deep dive into the latest developments in artificial intelligence and machine learning.',
        date: '2026-06-15',
        location: 'Seattle, WA',
        category: 'Technology',
        price: 399,
        attendees: 1200,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
    },
];

// Features data
const features = [
    {
        icon: FiZap,
        title: 'Lightning Fast',
        description: 'Create and publish events in minutes with our intuitive platform.',
    },
    {
        icon: FiShield,
        title: 'Secure Payments',
        description: 'Industry-leading security for all transactions and data.',
    },
    {
        icon: FiGlobe,
        title: 'Global Reach',
        description: 'Connect with attendees from around the world effortlessly.',
    },
];

// Feature item animation
const featureVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

const Home = () => {
    const handleEventClick = (eventId) => {
        console.log('Clicked event:', eventId);
        // Navigate to event details
    };

    return (
        <AnimatedPage className="home-page">
            {/* Hero Section */}
            <Hero />

            {/* Events Section */}
            <EventGrid
                events={sampleEvents}
                onEventClick={handleEventClick}
            />

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <motion.div
                        className="features-header"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="features-title">
                            Why Choose <span className="gradient-text">EventFlow</span>?
                        </h2>
                        <p className="features-subtitle">
                            Everything you need to create, manage, and grow successful events
                        </p>
                    </motion.div>

                    <div className="features-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    className="feature-card"
                                    variants={featureVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-50px' }}
                                    custom={index}
                                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                >
                                    <div className="feature-icon">
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="cta-glow" />
                        <h2 className="cta-title">
                            Ready to Create Your Next Event?
                        </h2>
                        <p className="cta-description">
                            Join thousands of event organizers who trust EventFlow to bring their vision to life.
                        </p>
                        <AnimatedButton
                            variant="primary"
                            size="lg"
                            icon={<FiArrowRight />}
                        >
                            Get Started Free
                        </AnimatedButton>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <span className="footer-logo">Event<span>Flow</span></span>
                            <p>Making events unforgettable since 2024</p>
                        </div>
                        <div className="footer-links">
                            <a href="/about">About</a>
                            <a href="/events">Events</a>
                            <a href="/privacy">Privacy</a>
                            <a href="/terms">Terms</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 EventFlow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </AnimatedPage>
    );
};

export default Home;
