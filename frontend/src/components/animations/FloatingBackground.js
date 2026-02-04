/**
 * FloatingBackground Component
 * 
 * Creates animated floating gradient orbs that slowly move around the screen.
 * This provides the "antigravity" ambient effect that makes the UI feel premium.
 */

import { motion, useReducedMotion } from 'framer-motion';
import './FloatingBackground.css';

const FloatingBackground = () => {
    const prefersReducedMotion = useReducedMotion();

    // Don't animate if user prefers reduced motion
    if (prefersReducedMotion) {
        return (
            <div className="floating-gradients">
                <div className="floating-gradient floating-gradient-1 static" />
                <div className="floating-gradient floating-gradient-2 static" />
                <div className="floating-gradient floating-gradient-3 static" />
            </div>
        );
    }

    return (
        <div className="floating-gradients">
            {/* Primary purple gradient - top left */}
            <motion.div
                className="floating-gradient floating-gradient-1"
                animate={{
                    x: [0, 50, 100, 25, 0],
                    y: [0, 100, 50, 75, 0],
                    scale: [1, 1.1, 0.9, 1.05, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            />

            {/* Cyan accent gradient - right side */}
            <motion.div
                className="floating-gradient floating-gradient-2"
                animate={{
                    x: [0, -80, -40, -60, 0],
                    y: [0, -60, 40, -30, 0],
                    scale: [1, 1.15, 0.95, 1.1, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            />

            {/* Secondary purple gradient - bottom */}
            <motion.div
                className="floating-gradient floating-gradient-3"
                animate={{
                    x: [0, 60, 30, 80, 0],
                    y: [0, -80, -40, -60, 0],
                    scale: [1, 1.1, 1.05, 0.95, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            />

            {/* Additional subtle gradient */}
            <motion.div
                className="floating-gradient floating-gradient-4"
                animate={{
                    x: [0, -40, 20, -30, 0],
                    y: [0, 40, 80, 20, 0],
                    scale: [1, 0.9, 1.1, 0.95, 1],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
};

export default FloatingBackground;
