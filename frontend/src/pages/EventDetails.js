/**
 * Event Details Page
 * 
 * Single event view with:
 * - Hero image with parallax
 * - Animated content sections
 * - Payment integration
 * - Related events
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    FiCalendar, FiMapPin, FiUsers, FiClock, FiShare2,
    FiHeart, FiArrowLeft, FiCheck, FiMinus, FiPlus
} from 'react-icons/fi';
import { AnimatedPage } from '../components/animations/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { PaymentModal } from '../components/payment';
import { useAuth } from '../context/AuthContext';
import './EventDetails.css';

// Sample events data (expanded from Events.js to include details)
const staticEvents = [
    {
        id: 1,
        title: 'Tech Innovation Summit 2026',
        description: `Join industry leaders and innovators for a transformative day of insights, networking, and inspiration. The Tech Innovation Summit brings together the brightest minds in technology to explore the future of digital transformation.
        
This year's summit features keynote speeches from Fortune 500 executives, hands-on workshops, and exclusive networking opportunities. Whether you're a startup founder, enterprise leader, or technology enthusiast, you'll gain valuable insights to drive innovation in your organization.`,
        date: '2026-03-15',
        time: '9:00 AM - 6:00 PM',
        location: 'Moscone Center, San Francisco, CA',
        category: 'Technology',
        price: 299,
        attendees: 2500,
        capacity: 3000,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
        organizer: {
            name: 'TechEvents Inc.',
            avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100',
            events: 45,
        },
        highlights: [
            'Keynote speeches from industry leaders',
            'Hands-on workshops and demos',
            'Exclusive networking sessions',
            'Swag bags for all attendees',
            'Catered lunch and refreshments',
        ],
        schedule: [
            { time: '9:00 AM', title: 'Registration & Networking Breakfast' },
            { time: '10:00 AM', title: 'Opening Keynote: Future of AI' },
            { time: '11:30 AM', title: 'Workshop Sessions (Choose 1 of 3)' },
            { time: '1:00 PM', title: 'Networking Lunch' },
            { time: '2:30 PM', title: 'Panel Discussion: Tech Leadership' },
            { time: '4:00 PM', title: 'Closing Keynote & Awards' },
            { time: '5:30 PM', title: 'Evening Reception' },
        ],
    },
    {
        id: 2,
        title: 'Sunset Music Festival',
        description: 'Experience three days of incredible live music performances from world-class artists at the beautiful coastal venue.',
        date: '2026-04-20',
        time: '4:00 PM - 11:00 PM',
        location: 'Broad Beach, Los Angeles, CA',
        category: 'Music',
        price: 150,
        attendees: 15000,
        capacity: 20000,
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200',
        organizer: {
            name: 'Vibe Nation',
            avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100',
            events: 120,
        }
    },
    {
        id: 3,
        title: 'Startup Pitch Competition',
        description: 'Watch innovative startups compete for funding and mentorship opportunities in front of top-tier VCs.',
        date: '2026-03-28',
        time: '10:00 AM - 4:00 PM',
        location: 'Tech Hub, New York, NY',
        category: 'Business',
        price: 0,
        attendees: 320,
        capacity: 500,
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200',
        organizer: {
            name: 'NYC Founders',
            avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100',
            events: 12,
        }
    }
];

// Default data for new user-created events
const defaultEventExtras = {
    organizer: {
        name: 'Community Organizer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        events: 1,
    },
    highlights: [
        'Engaging community session',
        'Networking opportunities',
        'Expert presentations',
        'Q&A Session',
    ],
    schedule: [
        { time: '09:00 AM', title: 'Event Start & Introduction' },
        { time: '11:00 AM', title: 'Main Program' },
        { time: '01:00 PM', title: 'Lunch Break' },
        { time: '02:30 PM', title: 'Workshop & Discussion' },
        { time: '05:00 PM', title: 'Closing Remarks' },
    ]
};

// Animation variants
const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
    },
};

const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketCount, setTicketCount] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Parallax scroll effect for hero image
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

    // Load event data
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            // Check static events
            let foundEvent = staticEvents.find(e => e.id.toString() === id.toString());

            // If not found, check approved events in localStorage
            if (!foundEvent) {
                const approvedEvents = JSON.parse(localStorage.getItem('approvedEvents') || '[]');
                foundEvent = approvedEvents.find(e => e.id.toString() === id.toString());

                // If found in localStorage, merge with default extras
                if (foundEvent) {
                    foundEvent = {
                        ...defaultEventExtras,
                        ...foundEvent,
                        time: foundEvent.time || '9:00 AM - 5:00 PM'
                    };
                }
            }

            // Also check pending events if the user is the creator or an admin
            if (!foundEvent) {
                const pendingEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
                foundEvent = pendingEvents.find(e => e.id.toString() === id.toString());
                if (foundEvent) {
                    foundEvent = {
                        ...defaultEventExtras,
                        ...foundEvent,
                        time: foundEvent.time || '9:00 AM - 5:00 PM'
                    };
                }
            }

            setEvent(foundEvent);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [id]);

    // Open payment modal
    const handleBooking = () => {
        if (!isAuthenticated) {
            toast.error('Login Required', 'Please login to book tickets');
            navigate('/login', { state: { from: `/events/${id}` } });
            return;
        }
        setIsPaymentOpen(true);
    };

    // Handle successful payment
    const handlePaymentSuccess = (paymentData) => {
        console.log('Payment successful:', paymentData);
        setIsPaymentOpen(false);
        // Navigate to bookings page after a short delay
        setTimeout(() => {
            navigate('/bookings');
        }, 500);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.info('Link Copied', 'Event link copied to clipboard');
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) {
        return (
            <AnimatedPage className="event-details-page">
                <div className="event-details-skeleton">
                    <Skeleton height="400px" borderRadius="0" />
                    <div className="container">
                        <div className="skeleton-content">
                            <Skeleton height="40px" width="60%" />
                            <Skeleton height="20px" width="40%" />
                            <Skeleton height="200px" />
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    if (!event) {
        return (
            <AnimatedPage className="event-details-page">
                <div className="container">
                    <div className="event-not-found">
                        <h2>Event Not Found</h2>
                        <p>The event you're looking for doesn't exist.</p>
                        <Link to="/events">
                            <AnimatedButton variant="primary">Browse Events</AnimatedButton>
                        </Link>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    const spotsLeft = event.capacity - event.attendees;
    const totalPrice = event.price * ticketCount;

    return (
        <AnimatedPage className="event-details-page">
            {/* Hero Image */}
            <motion.div
                className="event-hero"
                style={{ y: heroY }}
            >
                <motion.img
                    src={event.image}
                    alt={event.title}
                    className="hero-image"
                    style={{ opacity: heroOpacity }}
                />
                <div className="hero-overlay" />

                {/* Back button */}
                <Link to="/events" className="back-button">
                    <FiArrowLeft />
                    <span>Back to Events</span>
                </Link>

                {/* Action buttons */}
                <div className="hero-actions">
                    <motion.button
                        className={`action-btn ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiHeart />
                    </motion.button>
                    <motion.button
                        className="action-btn"
                        onClick={handleShare}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FiShare2 />
                    </motion.button>
                </div>
            </motion.div>

            {/* Content */}
            <div className="event-content">
                <div className="container">
                    <div className="event-layout">
                        {/* Main Content */}
                        <motion.div
                            className="event-main"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {/* Category & Title */}
                            <motion.div variants={fadeInUp}>
                                <span className="event-category">{event.category}</span>
                                <h1 className="event-title">{event.title}</h1>
                                {event.status === 'pending' && (
                                    <span style={{
                                        padding: '4px 12px',
                                        background: 'rgba(245, 158, 11, 0.15)',
                                        color: '#f59e0b',
                                        fontSize: '0.8rem',
                                        borderRadius: '20px',
                                        fontWeight: '600'
                                    }}>
                                        Pending Approval
                                    </span>
                                )}
                            </motion.div>

                            {/* Meta info */}
                            <motion.div className="event-meta" variants={fadeInUp}>
                                <div className="meta-item">
                                    <FiCalendar className="meta-icon" />
                                    <span>{formatDate(event.date)}</span>
                                </div>
                                <div className="meta-item">
                                    <FiClock className="meta-icon" />
                                    <span>{event.time}</span>
                                </div>
                                <div className="meta-item">
                                    <FiMapPin className="meta-icon" />
                                    <span>{event.location}</span>
                                </div>
                                <div className="meta-item">
                                    <FiUsers className="meta-icon" />
                                    <span>{event.attendees.toLocaleString()} attending</span>
                                </div>
                            </motion.div>

                            {/* Organizer */}
                            <motion.div className="event-organizer" variants={fadeInUp}>
                                <img src={event.organizer.avatar} alt={event.organizer.name} />
                                <div>
                                    <span className="organizer-label">Organized by</span>
                                    <span className="organizer-name">{event.organizer.name}</span>
                                </div>
                            </motion.div>

                            {/* Description */}
                            <motion.div className="event-section" variants={fadeInUp}>
                                <h2>About This Event</h2>
                                <div className="event-description">
                                    {event.description.split('\n\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Highlights */}
                            {event.highlights && (
                                <motion.div className="event-section" variants={fadeInUp}>
                                    <h2>What's Included</h2>
                                    <ul className="event-highlights">
                                        {event.highlights.map((highlight, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <FiCheck className="check-icon" />
                                                <span>{highlight}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Schedule */}
                            {event.schedule && (
                                <motion.div className="event-section" variants={fadeInUp}>
                                    <h2>Event Schedule</h2>
                                    <div className="event-schedule">
                                        {event.schedule.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                className="schedule-item"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <span className="schedule-time">{item.time}</span>
                                                <span className="schedule-title">{item.title}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Sidebar - Booking Card */}
                        <motion.div
                            className="event-sidebar"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="booking-card">
                                <div className="booking-price">
                                    <span className="price-label">Price per ticket</span>
                                    <span className="price-value">
                                        {event.price === 0 ? 'Free' : `₹${event.price}`}
                                    </span>
                                </div>

                                <div className="booking-availability">
                                    <span className={`spots-badge ${spotsLeft < 100 ? 'low' : ''}`}>
                                        {spotsLeft} spots left
                                    </span>
                                </div>

                                <div className="ticket-selector">
                                    <span className="selector-label">Number of tickets</span>
                                    <div className="selector-controls">
                                        <button
                                            className="selector-btn"
                                            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                            disabled={ticketCount <= 1}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="ticket-count">{ticketCount}</span>
                                        <button
                                            className="selector-btn"
                                            onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                                            disabled={ticketCount >= 10}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>
                                </div>

                                <div className="booking-total">
                                    <span>Total</span>
                                    <span className="total-value">
                                        {event.price === 0 ? 'Free' : `₹${totalPrice}`}
                                    </span>
                                </div>

                                <AnimatedButton
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleBooking}
                                    disabled={event.status === 'pending'}
                                >
                                    {event.status === 'pending' ? 'Pending Approval' : 'Book Now'}
                                </AnimatedButton>

                                <p className="booking-note">
                                    Free cancellation up to 24 hours before the event
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                event={event}
                onPaymentSuccess={handlePaymentSuccess}
                user={user || {
                    name: 'Guest User',
                    email: 'guest@example.com',
                    phone: '',
                }}
            />
        </AnimatedPage>
    );
};

export default EventDetails;
