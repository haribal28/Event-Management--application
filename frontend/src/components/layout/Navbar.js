/**
 * Navbar Component
 * 
 * Premium animated navigation bar with:
 * - Glass morphism design
 * - Auth-aware navigation
 * - Admin menu for admin users
 * - Mobile responsive with staggered animations
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    FiMenu, FiX, FiCalendar, FiUser, FiLogOut, FiPlus,
    FiGrid, FiBookmark, FiSettings, FiChevronDown
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

// Link hover animation
const linkVariants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 }
    },
};

// Underline animation for active link
const underlineVariants = {
    initial: { scaleX: 0 },
    animate: {
        scaleX: 1,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
};

// Mobile menu animations
const mobileMenuVariants = {
    closed: {
        opacity: 0,
        x: '100%',
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
        },
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const mobileItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 }
    },
};

// Dropdown animation
const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: { duration: 0.15 }
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
    },
};

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const prefersReducedMotion = useReducedMotion();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-menu')) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Public navigation links
    const publicLinks = [
        { path: '/', label: 'Home' },
        { path: '/events', label: 'Events' },
        { path: '/about', label: 'About' },
    ];

    // Authenticated navigation links
    const authLinks = [
        { path: '/', label: 'Home' },
        { path: '/events', label: 'Events' },
        { path: '/bookings', label: 'My Bookings', icon: FiBookmark },
    ];

    // Admin links
    const adminLinks = [
        { path: '/admin', label: 'Dashboard', icon: FiGrid },
        { path: '/admin/events', label: 'Manage Events', icon: FiCalendar },
        { path: '/admin/bookings', label: 'All Bookings', icon: FiBookmark },
    ];

    const navLinks = isAuthenticated ? authLinks : publicLinks;
    const isActive = (path) => location.pathname === path;

    return (
        <motion.nav
            className={`navbar ${isScrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <motion.div
                        className="logo-icon"
                        whileHover={prefersReducedMotion ? {} : { rotate: 10, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                    >
                        <FiCalendar />
                    </motion.div>
                    <span className="logo-text">
                        Event<span className="logo-accent">Flow</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {navLinks.map((link) => (
                        <motion.div
                            key={link.path}
                            variants={linkVariants}
                            initial="rest"
                            whileHover="hover"
                            className="nav-link-wrapper"
                        >
                            <Link
                                to={link.path}
                                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            >
                                {link.label}
                                {isActive(link.path) && (
                                    <motion.div
                                        className="nav-link-underline"
                                        variants={underlineVariants}
                                        initial="initial"
                                        animate="animate"
                                        layoutId="navUnderline"
                                    />
                                )}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Admin Dropdown */}
                    {isAdmin && (
                        <div className="nav-link-wrapper admin-dropdown">
                            <button
                                className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <FiSettings size={16} />
                                Admin
                                <FiChevronDown
                                    size={14}
                                    style={{
                                        transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                />
                            </button>
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        className="dropdown-menu"
                                        variants={dropdownVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                    >
                                        {adminLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className={`dropdown-item ${isActive(link.path) ? 'active' : ''}`}
                                            >
                                                <link.icon size={16} />
                                                {link.label}
                                            </Link>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Desktop Actions */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/create-event" className="nav-action-btn create-btn">
                                <FiPlus />
                                <span>Create Event</span>
                            </Link>

                            <div className="user-menu">
                                <motion.button
                                    className="user-avatar"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsUserMenuOpen(!isUserMenuOpen);
                                    }}
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {user?.name?.charAt(0).toUpperCase() || <FiUser />}
                                        </div>
                                    )}
                                </motion.button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            className="user-dropdown"
                                            variants={dropdownVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                        >
                                            <div className="user-info">
                                                <span className="user-name">{user?.name || 'User'}</span>
                                                <span className="user-email">{user?.email}</span>
                                            </div>
                                            <div className="dropdown-divider" />
                                            <Link to="/profile" className="dropdown-item">
                                                <FiUser size={16} />
                                                Profile
                                            </Link>
                                            <Link to="/bookings" className="dropdown-item">
                                                <FiBookmark size={16} />
                                                My Bookings
                                            </Link>
                                            {isAdmin && (
                                                <Link to="/admin" className="dropdown-item">
                                                    <FiGrid size={16} />
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <div className="dropdown-divider" />
                                            <button onClick={handleLogout} className="dropdown-item logout">
                                                <FiLogOut size={16} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-action-btn ghost">
                                Sign In
                            </Link>
                            <Link to="/register" className="nav-action-btn primary">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence mode="wait">
                        {isMobileMenuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiX size={24} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiMenu size={24} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        variants={mobileMenuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <div className="mobile-menu-content">
                            {navLinks.map((link) => (
                                <motion.div key={link.path} variants={mobileItemVariants}>
                                    <Link
                                        to={link.path}
                                        className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}

                            {isAdmin && (
                                <>
                                    <motion.div className="mobile-menu-divider" variants={mobileItemVariants} />
                                    <motion.div variants={mobileItemVariants}>
                                        <span className="mobile-menu-label">Admin</span>
                                    </motion.div>
                                    {adminLinks.map((link) => (
                                        <motion.div key={link.path} variants={mobileItemVariants}>
                                            <Link
                                                to={link.path}
                                                className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                                            >
                                                <link.icon size={18} />
                                                {link.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </>
                            )}

                            <motion.div className="mobile-menu-divider" variants={mobileItemVariants} />

                            {isAuthenticated ? (
                                <>
                                    <motion.div variants={mobileItemVariants}>
                                        <Link to="/create-event" className="mobile-nav-link">
                                            <FiPlus size={18} />
                                            Create Event
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={mobileItemVariants}>
                                        <Link to="/profile" className="mobile-nav-link">
                                            <FiUser size={18} />
                                            Profile
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={mobileItemVariants}>
                                        <button onClick={handleLogout} className="mobile-nav-link logout">
                                            <FiLogOut size={18} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <motion.div variants={mobileItemVariants}>
                                        <Link to="/login" className="mobile-nav-link">
                                            Sign In
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={mobileItemVariants}>
                                        <Link to="/register" className="mobile-nav-btn primary">
                                            Get Started
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
