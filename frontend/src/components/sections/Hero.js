/**
 * Hero Section Component
 * 
 * Premium landing hero with:
 * - Animated floating elements (antigravity effect)
 * - Parallax scrolling effect
 * - Staggered text animations
 * - Gradient text and glowing CTAs
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FiArrowRight, FiPlay, FiStar, FiUsers, FiCalendar } from 'react-icons/fi';
import AnimatedButton from '../ui/AnimatedButton';
import './Hero.css';

// Stagger animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

// Floating animation for decorative elements
const floatVariants = {
    animate: (custom) => ({
        y: [0, custom.y, 0],
        x: [0, custom.x, 0],
        rotate: [0, custom.rotate, 0],
        transition: {
            duration: custom.duration,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    }),
};

// Stats data
const stats = [
    { icon: FiCalendar, value: '10K+', label: 'Events' },
    { icon: FiUsers, value: '50K+', label: 'Attendees' },
    { icon: FiStar, value: '4.9', label: 'Rating' },
];

const Hero = () => {
    const heroRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    // Parallax scroll effect
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={heroRef} className="hero">
            {/* Parallax background elements */}
            <div className="hero-parallax">
                {!prefersReducedMotion && (
                    <>
                        <motion.div
                            className="parallax-orb orb-1"
                            style={{ y: y1 }}
                        />
                        <motion.div
                            className="parallax-orb orb-2"
                            style={{ y: y2 }}
                        />
                    </>
                )}
            </div>

            {/* Floating decorative elements */}
            <div className="hero-floating-elements">
                <motion.div
                    className="floating-card floating-card-1"
                    variants={floatVariants}
                    animate={prefersReducedMotion ? {} : "animate"}
                    custom={{ y: -20, x: 10, rotate: 5, duration: 6 }}
                >
                    <FiCalendar size={24} />
                    <span>Tech Summit 2026</span>
                </motion.div>

                <motion.div
                    className="floating-card floating-card-2"
                    variants={floatVariants}
                    animate={prefersReducedMotion ? {} : "animate"}
                    custom={{ y: 25, x: -15, rotate: -3, duration: 7 }}
                >
                    <div className="floating-avatars">
                        <span className="avatar">👨‍💻</span>
                        <span className="avatar">👩‍🎨</span>
                        <span className="avatar">🧑‍🔬</span>
                    </div>
                    <span>+2.5k joining</span>
                </motion.div>

                <motion.div
                    className="floating-card floating-card-3"
                    variants={floatVariants}
                    animate={prefersReducedMotion ? {} : "animate"}
                    custom={{ y: -15, x: -8, rotate: 8, duration: 5 }}
                >
                    <FiStar className="star-icon" />
                    <span>Featured Event</span>
                </motion.div>
            </div>

            {/* Main hero content */}
            <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ opacity: prefersReducedMotion ? 1 : opacity }}
            >
                {/* Badge */}
                <motion.div className="hero-badge" variants={itemVariants}>
                    <span className="badge-dot" />
                    <span>The Future of Event Management</span>
                </motion.div>

                {/* Heading */}
                <motion.h1 className="hero-title" variants={itemVariants}>
                    Discover & Create
                    <span className="hero-title-gradient"> Unforgettable </span>
                    Events
                </motion.h1>

                {/* Subheading */}
                <motion.p className="hero-description" variants={itemVariants}>
                    Join millions of people discovering, attending, and organizing
                    extraordinary events around the world. Your next amazing experience
                    starts here.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div className="hero-actions" variants={itemVariants}>
                    <AnimatedButton
                        variant="primary"
                        size="lg"
                        icon={<FiArrowRight />}
                    >
                        Explore Events
                    </AnimatedButton>

                    <AnimatedButton
                        variant="secondary"
                        size="lg"
                        icon={<FiPlay />}
                    >
                        Watch Demo
                    </AnimatedButton>
                </motion.div>

                {/* Stats */}
                <motion.div className="hero-stats" variants={itemVariants}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                className="stat-item"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <Icon className="stat-icon" />
                                <div className="stat-content">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <motion.div
                    className="scroll-mouse"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <span className="scroll-wheel" />
                </motion.div>
                <span className="scroll-text">Scroll to explore</span>
            </motion.div>
        </section>
    );
};

export default Hero;
