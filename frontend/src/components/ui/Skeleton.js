/**
 * Skeleton Components
 * 
 * Animated skeleton loaders with smooth shimmer effect.
 * Used while content is loading to provide visual feedback.
 */

import { motion } from 'framer-motion';
import './Skeleton.css';

// Base skeleton component
export const Skeleton = ({
    width,
    height,
    borderRadius = '0.5rem',
    className = '',
    style = {},
}) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius,
                ...style,
            }}
        />
    );
};

// Text line skeleton
export const SkeletonText = ({ lines = 1, className = '' }) => {
    return (
        <div className={`skeleton-text-container ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className="skeleton skeleton-text"
                    style={{
                        width: index === lines - 1 && lines > 1 ? '70%' : '100%',
                    }}
                />
            ))}
        </div>
    );
};

// Event Card Skeleton
export const EventCardSkeleton = () => {
    return (
        <motion.div
            className="event-card-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image placeholder */}
            <div className="skeleton skeleton-card-image" />

            {/* Content */}
            <div className="skeleton-card-content">
                {/* Category badge */}
                <div className="skeleton skeleton-badge" />

                {/* Title */}
                <div className="skeleton skeleton-title" />

                {/* Description */}
                <div className="skeleton-text-container">
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text" style={{ width: '80%' }} />
                </div>

                {/* Meta */}
                <div className="skeleton-meta">
                    <div className="skeleton skeleton-meta-item" />
                    <div className="skeleton skeleton-meta-item" />
                </div>

                {/* Action */}
                <div className="skeleton skeleton-action" />
            </div>
        </motion.div>
    );
};

// Booking Card Skeleton
export const BookingCardSkeleton = () => {
    return (
        <motion.div
            className="booking-card-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="skeleton skeleton-avatar-large" />

            <div className="skeleton-booking-content">
                <div className="skeleton skeleton-title" style={{ width: '60%' }} />
                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                <div className="skeleton skeleton-text" style={{ width: '30%' }} />
            </div>

            <div className="skeleton skeleton-button-skeleton" />
        </motion.div>
    );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
    return (
        <motion.div
            className="profile-skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="skeleton skeleton-avatar-xl" />
            <div className="skeleton-profile-info">
                <div className="skeleton skeleton-name" />
                <div className="skeleton skeleton-email" />
                <div className="skeleton skeleton-bio" />
                <div className="skeleton skeleton-bio" style={{ width: '60%' }} />
            </div>
        </motion.div>
    );
};

// Grid of skeleton cards
export const EventGridSkeleton = ({ count = 6 }) => {
    return (
        <div className="event-grid-skeleton">
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                    <EventCardSkeleton />
                </motion.div>
            ))}
        </div>
    );
};

export default Skeleton;
