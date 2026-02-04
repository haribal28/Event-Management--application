/**
 * EventCard Component
 * 
 * Premium animated event card with:
 * - Antigravity floating effect on hover
 * - Soft expanding shadow on hover
 * - Staggered content fade-in
 * - Glass morphism design
 * - React Router navigation
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';
import './EventCard.css';

// Stagger animation for card content
const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

const EventCard = ({
    id,
    title,
    description,
    date,
    location,
    attendees,
    image,
    category,
    price,
    onClick,
}) => {
    const prefersReducedMotion = useReducedMotion();

    // Card hover animation
    const cardVariants = {
        rest: {
            y: 0,
            scale: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
        hover: prefersReducedMotion ? {} : {
            y: -8,
            scale: 1.02,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(139, 92, 246, 0.15)',
            transition: {
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Image animation
    const imageVariants = {
        rest: { scale: 1 },
        hover: prefersReducedMotion ? {} : {
            scale: 1.1,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    };

    // Arrow animation
    const arrowVariants = {
        rest: { x: 0, opacity: 0.7 },
        hover: {
            x: 5,
            opacity: 1,
            transition: {
                duration: 0.2,
                ease: 'easeOut',
            },
        },
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Handle click - either use provided onClick or navigate
    const handleClick = (e) => {
        if (onClick) {
            onClick(id);
        }
    };

    return (
        <Link to={`/events/${id}`} style={{ textDecoration: 'none' }}>
            <motion.article
                className="event-card"
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                onClick={handleClick}
                layout
            >
                {/* Glow border effect */}
                <div className="event-card__glow" />

                {/* Image section */}
                <div className="event-card__image-container">
                    <motion.img
                        src={image || '/placeholder-event.jpg'}
                        alt={title}
                        className="event-card__image"
                        variants={imageVariants}
                    />
                    <div className="event-card__image-overlay" />

                    {/* Category badge */}
                    {category && (
                        <motion.span
                            className="event-card__category"
                            custom={0}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {category}
                        </motion.span>
                    )}

                    {/* Price badge */}
                    {price !== undefined && (
                        <motion.span
                            className="event-card__price"
                            custom={1}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {price === 0 ? 'Free' : `₹${price}`}
                        </motion.span>
                    )}
                </div>

                {/* Content section */}
                <div className="event-card__content">
                    <motion.h3
                        className="event-card__title"
                        custom={2}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {title}
                    </motion.h3>

                    <motion.p
                        className="event-card__description"
                        custom={3}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {description}
                    </motion.p>

                    {/* Meta information */}
                    <motion.div
                        className="event-card__meta"
                        custom={4}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="event-card__meta-item">
                            <FiCalendar className="event-card__meta-icon" />
                            <span>{formatDate(date)}</span>
                        </div>

                        <div className="event-card__meta-item">
                            <FiMapPin className="event-card__meta-icon" />
                            <span>{location}</span>
                        </div>

                        {attendees !== undefined && (
                            <div className="event-card__meta-item">
                                <FiUsers className="event-card__meta-icon" />
                                <span>{attendees.toLocaleString()} going</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Action row */}
                    <motion.div
                        className="event-card__action"
                        custom={5}
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <span className="event-card__action-text">View Details</span>
                        <motion.span
                            className="event-card__action-arrow"
                            variants={arrowVariants}
                        >
                            <FiArrowRight />
                        </motion.span>
                    </motion.div>
                </div>

                {/* Floating particles for premium effect */}
                <div className="event-card__particles">
                    <span className="particle particle-1" />
                    <span className="particle particle-2" />
                    <span className="particle particle-3" />
                </div>
            </motion.article>
        </Link>
    );
};

export default EventCard;
