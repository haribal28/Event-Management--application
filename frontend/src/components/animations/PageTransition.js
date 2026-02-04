/**
 * PageTransition Component
 * 
 * Wraps routes with smooth enter/exit animations using Framer Motion's AnimatePresence.
 * Features fade + slide + subtle scale for premium feel.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Page transition variants - fade + slide + scale
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smoothness
            when: 'beforeChildren',
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Stagger children animation
export const staggerContainer = {
    initial: {},
    enter: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
    exit: {
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

// Fade up animation for child elements
export const fadeInUp = {
    initial: {
        opacity: 0,
        y: 30,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
        },
    },
};

// Fade in scale animation
export const fadeInScale = {
    initial: {
        opacity: 0,
        scale: 0.9,
    },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1], // Bouncy ease
        },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.3,
        },
    },
};

// Slide in from left
export const slideInLeft = {
    initial: {
        opacity: 0,
        x: -60,
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        x: 60,
        transition: {
            duration: 0.3,
        },
    },
};

// Slide in from right
export const slideInRight = {
    initial: {
        opacity: 0,
        x: 60,
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        x: -60,
        transition: {
            duration: 0.3,
        },
    },
};

// Page wrapper component with AnimatePresence
export const PageTransition = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                style={{ width: '100%' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

// Animated page wrapper - use inside each page component
export const AnimatedPage = ({ children, className = '' }) => {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="enter"
            exit="exit"
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Motion div wrapper for fade up animation
export const FadeInUp = ({ children, delay = 0, className = '', ...props }) => {
    return (
        <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="enter"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Motion div wrapper for scale animation
export const FadeInScale = ({ children, delay = 0, className = '', ...props }) => {
    return (
        <motion.div
            variants={fadeInScale}
            initial="initial"
            whileInView="enter"
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
