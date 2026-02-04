/**
 * Events Page
 * 
 * Full events listing with:
 * - Advanced filtering
 * - Search functionality
 * - Category tabs with animations
 * - Event cards with hover effects
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiCalendar, FiGrid, FiList } from 'react-icons/fi';
import { AnimatedPage } from '../components/animations/PageTransition';
import EventCard from '../components/ui/EventCard';
import { EventGridSkeleton } from '../components/ui/Skeleton';
import AnimatedButton from '../components/ui/AnimatedButton';
import './Events.css';

// Sample events data
const staticEvents = [
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
    {
        id: 7,
        title: 'Jazz Night Live',
        description: 'An evening of smooth jazz performances featuring renowned artists.',
        date: '2026-03-22',
        location: 'New Orleans, LA',
        category: 'Music',
        price: 65,
        attendees: 800,
        image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    },
    {
        id: 8,
        title: 'Leadership Summit',
        description: 'Learn from world-class leaders and executives about building successful organizations.',
        date: '2026-04-12',
        location: 'Miami, FL',
        category: 'Business',
        price: 499,
        attendees: 1500,
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    },
    {
        id: 9,
        title: 'Food & Wine Festival',
        description: 'Taste exquisite cuisines and fine wines from around the world.',
        date: '2026-05-25',
        location: 'Napa Valley, CA',
        category: 'Food',
        price: 125,
        attendees: 5000,
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    },
];

// Categories
const categoriesList = [
    { id: 'all', label: 'All', icon: FiGrid },
    { id: 'technology', label: 'Technology', icon: FiGrid },
    { id: 'music', label: 'Music', icon: FiGrid },
    { id: 'business', label: 'Business', icon: FiGrid },
    { id: 'sports', label: 'Sports', icon: FiGrid },
    { id: 'arts', label: 'Arts', icon: FiGrid },
    { id: 'food', label: 'Food', icon: FiGrid },
];

// Animation variants
const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [showFilters, setShowFilters] = useState(false);

    // Simulate loading events
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            // Load approved events from localStorage
            const approvedEvents = JSON.parse(localStorage.getItem('approvedEvents') || '[]');
            setEvents([...staticEvents, ...approvedEvents]);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Filter events
    const filteredEvents = events.filter((event) => {
        const matchesCategory = activeCategory === 'all' ||
            event.category.toLowerCase() === activeCategory;
        const matchesSearch = !searchQuery ||
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const handleEventClick = (eventId) => {
        console.log('Navigate to event:', eventId);
    };

    return (
        <AnimatedPage className="events-page">
            {/* Header */}
            <motion.div
                className="events-header"
                variants={headerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="container">
                    <h1 className="events-title">Discover Events</h1>
                    <p className="events-subtitle">
                        Find and join amazing events happening around you
                    </p>
                </div>
            </motion.div>

            {/* Filters Bar */}
            <motion.div
                className="events-filters-bar"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="container">
                    <div className="filters-bar-content">
                        {/* Search */}
                        <div className="events-search">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Category tabs */}
                        <div className="category-tabs">
                            {categoriesList.map((category) => (
                                <motion.button
                                    key={category.id}
                                    className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {category.label}
                                    {activeCategory === category.id && (
                                        <motion.div
                                            className="tab-indicator"
                                            layoutId="tabIndicator"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* View toggle and filter button */}
                        <div className="filters-actions">
                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <FiGrid size={18} />
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <FiList size={18} />
                                </button>
                            </div>

                            <AnimatedButton
                                variant="secondary"
                                icon={<FiFilter />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Filters
                            </AnimatedButton>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Events Grid */}
            <section className="events-content">
                <div className="container">
                    {/* Results info */}
                    <motion.div
                        className="results-info"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="results-count">
                            {loading ? 'Loading...' : `${filteredEvents.length} events found`}
                        </span>
                        {activeCategory !== 'all' && (
                            <button
                                className="clear-filter"
                                onClick={() => setActiveCategory('all')}
                            >
                                Clear filter
                            </button>
                        )}
                    </motion.div>

                    {/* Events grid */}
                    {loading ? (
                        <EventGridSkeleton count={6} />
                    ) : filteredEvents.length > 0 ? (
                        <motion.div
                            className={`events-grid ${viewMode === 'list' ? 'list-view' : ''}`}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key={activeCategory + searchQuery}
                        >
                            {filteredEvents.map((event) => (
                                <motion.div key={event.id} variants={itemVariants} layout>
                                    <EventCard
                                        {...event}
                                        onClick={handleEventClick}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="no-results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="no-results-icon">🔍</div>
                            <h3>No events found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                            <AnimatedButton
                                variant="secondary"
                                onClick={() => {
                                    setActiveCategory('all');
                                    setSearchQuery('');
                                }}
                            >
                                Clear all filters
                            </AnimatedButton>
                        </motion.div>
                    )}

                    {/* Load more */}
                    {!loading && filteredEvents.length > 0 && (
                        <motion.div
                            className="load-more-section"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <AnimatedButton variant="secondary">
                                Load More Events
                            </AnimatedButton>
                        </motion.div>
                    )}
                </div>
            </section>
        </AnimatedPage>
    );
};

export default Events;
