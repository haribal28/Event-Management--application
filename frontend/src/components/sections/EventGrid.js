/**
 * EventGrid Section Component
 * 
 * Grid layout for event cards with:
 * - Staggered card entry animations
 * - Filter animations
 * - Infinite scroll ready
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from '../ui/EventCard';
import { EventGridSkeleton } from '../ui/Skeleton';
import AnimatedButton from '../ui/AnimatedButton';
import { FiFilter, FiSearch } from 'react-icons/fi';
import './EventGrid.css';

// Container animation with stagger
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

// Item animation
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
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.3 }
    },
};

// Filter chip animation
const filterVariants = {
    inactive: { scale: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
    active: {
        scale: 1.05,
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        transition: { type: 'spring', stiffness: 500 }
    },
};

const EventGrid = ({
    events = [],
    loading = false,
    title = 'Upcoming Events',
    showFilters = true,
    onEventClick,
}) => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter categories
    const categories = [
        { id: 'all', label: 'All Events' },
        { id: 'tech', label: 'Technology' },
        { id: 'music', label: 'Music' },
        { id: 'business', label: 'Business' },
        { id: 'sports', label: 'Sports' },
        { id: 'arts', label: 'Arts' },
    ];

    // Filter events when filter changes
    useEffect(() => {
        let filtered = events;

        // Apply category filter
        if (activeFilter !== 'all') {
            filtered = filtered.filter(event =>
                event.category?.toLowerCase() === activeFilter
            );
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.title?.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query) ||
                event.location?.toLowerCase().includes(query)
            );
        }

        setFilteredEvents(filtered);
    }, [activeFilter, searchQuery, events]);

    const handleFilterClick = (filterId) => {
        setActiveFilter(filterId);
    };

    return (
        <section className="event-grid-section">
            <div className="container">
                {/* Section header */}
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section-title">{title}</h2>
                    <p className="section-subtitle">
                        Discover events that match your interests and connect with like-minded people
                    </p>
                </motion.div>

                {/* Filters */}
                {showFilters && (
                    <motion.div
                        className="filters-container"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Search input */}
                        <div className="search-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* Filter chips */}
                        <div className="filter-chips">
                            {categories.map((category) => (
                                <motion.button
                                    key={category.id}
                                    className={`filter-chip ${activeFilter === category.id ? 'active' : ''}`}
                                    variants={filterVariants}
                                    animate={activeFilter === category.id ? 'active' : 'inactive'}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleFilterClick(category.id)}
                                >
                                    {category.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Event grid */}
                {loading ? (
                    <EventGridSkeleton count={6} />
                ) : (
                    <AnimatePresence mode="wait">
                        {filteredEvents.length > 0 ? (
                            <motion.div
                                className="events-grid"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                key={activeFilter}
                            >
                                {filteredEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        variants={itemVariants}
                                        layout
                                    >
                                        <EventCard
                                            {...event}
                                            onClick={onEventClick}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                className="no-events"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <div className="no-events-icon">🔍</div>
                                <h3>No events found</h3>
                                <p>Try adjusting your filters or search query</p>
                                <AnimatedButton
                                    variant="secondary"
                                    onClick={() => {
                                        setActiveFilter('all');
                                        setSearchQuery('');
                                    }}
                                >
                                    Clear Filters
                                </AnimatedButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Load more button */}
                {filteredEvents.length > 0 && !loading && (
                    <motion.div
                        className="load-more"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <AnimatedButton variant="secondary">
                            Load More Events
                        </AnimatedButton>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default EventGrid;
