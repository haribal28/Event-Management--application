/**
 * Spinner Components
 * 
 * Custom animated loading spinners with premium design.
 * Multiple variants for different use cases.
 */

import { motion } from 'framer-motion';
import './Spinner.css';

// Main circular spinner
export const Spinner = ({ size = 48, className = '' }) => {
    return (
        <div
            className={`spinner-container ${className}`}
            style={{ width: size, height: size }}
        >
            <motion.div
                className="spinner-ring spinner-ring-outer"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
            <motion.div
                className="spinner-ring spinner-ring-inner"
                animate={{ rotate: -360 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        </div>
    );
};

// Dots bouncing spinner
export const DotsSpinner = ({ className = '' }) => {
    const dotVariants = {
        initial: { y: 0 },
        animate: (i) => ({
            y: [-6, 0, -6],
            transition: {
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
            },
        }),
    };

    return (
        <div className={`dots-spinner ${className}`}>
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="dot"
                    custom={i}
                    variants={dotVariants}
                    initial="initial"
                    animate="animate"
                />
            ))}
        </div>
    );
};

// Pulse spinner
export const PulseSpinner = ({ size = 48, className = '' }) => {
    return (
        <div
            className={`pulse-spinner ${className}`}
            style={{ width: size, height: size }}
        >
            <motion.div
                className="pulse-ring"
                animate={{
                    scale: [1, 1.5, 1.5],
                    opacity: [0.8, 0, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                }}
            />
            <motion.div
                className="pulse-ring"
                animate={{
                    scale: [1, 1.5, 1.5],
                    opacity: [0.8, 0, 0],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 0.5,
                }}
            />
            <div className="pulse-center" />
        </div>
    );
};

// Gradient spinner
export const GradientSpinner = ({ size = 48, className = '' }) => {
    return (
        <div
            className={`gradient-spinner ${className}`}
            style={{ width: size, height: size }}
        >
            <motion.svg
                viewBox="0 0 50 50"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                <defs>
                    <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <circle
                    className="gradient-spinner-circle"
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="url(#spinnerGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="31.4 94.2"
                />
            </motion.svg>
        </div>
    );
};

// Full page loading overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => {
    return (
        <motion.div
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="loading-overlay-content">
                <GradientSpinner size={64} />
                <motion.p
                    className="loading-overlay-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Spinner;
