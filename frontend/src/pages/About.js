/**
 * About Page
 * 
 * Company/platform information with:
 * - Animated sections
 * - Team showcase
 * - Mission/values
 */

import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiUsers, FiGlobe, FiAward, FiTrendingUp } from 'react-icons/fi';
import { AnimatedPage } from '../components/animations/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import './About.css';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const cardVariants = {
    rest: { y: 0 },
    hover: {
        y: -8,
        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

// Values data
const values = [
    {
        icon: FiTarget,
        title: 'Mission Driven',
        description: 'We\'re on a mission to connect people through unforgettable experiences.',
    },
    {
        icon: FiHeart,
        title: 'Community First',
        description: 'Building meaningful connections between event organizers and attendees.',
    },
    {
        icon: FiUsers,
        title: 'Inclusive',
        description: 'Creating accessible experiences for everyone, everywhere.',
    },
];

// Stats data
const stats = [
    { value: '10M+', label: 'Events Created' },
    { value: '50M+', label: 'Tickets Sold' },
    { value: '190+', label: 'Countries' },
    { value: '99.9%', label: 'Uptime' },
];

// Team members
const team = [
    {
        name: 'Sarah Chen',
        role: 'CEO & Co-founder',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
        name: 'Michael Roberts',
        role: 'CTO & Co-founder',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
        name: 'Emily Watson',
        role: 'Head of Design',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    {
        name: 'David Kim',
        role: 'Head of Engineering',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
];

const About = () => {
    return (
        <AnimatedPage className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <motion.div
                        className="about-hero-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="hero-badge">About Us</span>
                        <h1 className="about-title">
                            We're Building the Future of{' '}
                            <span className="gradient-text">Live Experiences</span>
                        </h1>
                        <p className="about-subtitle">
                            EventFlow is the world's leading event management platform, connecting
                            millions of people with extraordinary experiences every day.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about-stats">
                <div className="container">
                    <motion.div
                        className="stats-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="stat-card"
                                variants={itemVariants}
                            >
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-values">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Our Values</h2>
                        <p className="section-subtitle">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <motion.div
                        className="values-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={value.title}
                                    className="value-card"
                                    variants={cardVariants}
                                    initial="rest"
                                    whileHover="hover"
                                >
                                    <motion.div variants={itemVariants}>
                                        <div className="value-icon">
                                            <Icon size={28} />
                                        </div>
                                        <h3 className="value-title">{value.title}</h3>
                                        <p className="value-description">{value.description}</p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story">
                <div className="container">
                    <div className="story-grid">
                        <motion.div
                            className="story-content"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="section-title">Our Story</h2>
                            <p>
                                Founded in 2024, EventFlow started with a simple idea: make it easy
                                for anyone to discover and create amazing events. What began as a
                                small startup has grown into a global platform serving millions of
                                users worldwide.
                            </p>
                            <p>
                                Today, we power everything from intimate gatherings to massive
                                festivals, helping event organizers bring their visions to life
                                and connecting attendees with experiences they'll never forget.
                            </p>
                            <AnimatedButton variant="primary">
                                Join Our Team
                            </AnimatedButton>
                        </motion.div>

                        <motion.div
                            className="story-image"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
                                alt="Team collaboration"
                            />
                            <div className="image-glow" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="about-team">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Meet Our Team</h2>
                        <p className="section-subtitle">
                            The passionate people behind EventFlow
                        </p>
                    </motion.div>

                    <motion.div
                        className="team-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                className="team-member"
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                            >
                                <div className="member-image">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <h3 className="member-name">{member.name}</h3>
                                <p className="member-role">{member.role}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="container">
                    <motion.div
                        className="cta-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Ready to Create Your Next Event?</h2>
                        <p>Join millions of event organizers who trust EventFlow</p>
                        <div className="cta-buttons">
                            <AnimatedButton variant="primary" size="lg">
                                Get Started Free
                            </AnimatedButton>
                            <AnimatedButton variant="secondary" size="lg">
                                Contact Sales
                            </AnimatedButton>
                        </div>
                    </motion.div>
                </div>
            </section>
        </AnimatedPage>
    );
};

export default About;
