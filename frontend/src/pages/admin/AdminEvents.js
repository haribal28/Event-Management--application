/**
 * Admin Events Page
 * 
 * Event management with:
 * - Events table with CRUD
 * - Search and filters
 * - Event approval functionality
 * - Delete confirmation
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye,
    FiX, FiCalendar, FiMapPin, FiUsers, FiCheckCircle
} from 'react-icons/fi';
import { AnimatedPage } from '../../components/animations/PageTransition';
import AnimatedButton from '../../components/ui/AnimatedButton';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { eventsAPI } from '../../services/api';
import './AdminEvents.css';

// Sample events data
const sampleEvents = [
    {
        id: 1,
        title: 'Tech Innovation Summit 2026',
        category: 'Technology',
        date: '2026-03-15',
        location: 'San Francisco, CA',
        price: 299,
        capacity: 3000,
        attendees: 2500,
        status: 'published',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100',
    },
    {
        id: 2,
        title: 'Sunset Music Festival',
        category: 'Music',
        date: '2026-04-20',
        location: 'Los Angeles, CA',
        price: 149,
        capacity: 5000,
        attendees: 4200,
        status: 'published',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100',
    },
    {
        id: 3,
        title: 'Startup Pitch Competition',
        category: 'Business',
        date: '2026-03-28',
        location: 'New York, NY',
        price: 0,
        capacity: 500,
        attendees: 320,
        status: 'draft',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=100',
    },
];

const AdminEvents = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState({ open: false, event: null });

    const [statusFilter, setStatusFilter] = useState(() => {
        return localStorage.getItem('admin_filter') || 'all';
    });

    // Clear filter after use
    useEffect(() => {
        localStorage.removeItem('admin_filter');
    }, []);

    // Fetch events
    const fetchEvents = () => {
        setLoading(true);
        try {
            // Load pending events from localStorage
            const pendingEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
            const approvedEvents = JSON.parse(localStorage.getItem('approvedEvents') || '[]');

            // Combine all
            const allEvents = [...sampleEvents, ...approvedEvents, ...pendingEvents];
            setEvents(allEvents);
        } catch (error) {
            setEvents(sampleEvents);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events by search and status
    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || event.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Handle delete
    const handleDelete = async () => {
        if (!deleteModal.event) return;

        // Remote from local state and update localStorage
        const eventId = deleteModal.event.id;

        // Remove from pending
        const pending = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
        const newPending = pending.filter(e => e.id !== eventId);
        localStorage.setItem('pendingEvents', JSON.stringify(newPending));

        // Remove from approved
        const approved = JSON.parse(localStorage.getItem('approvedEvents') || '[]');
        const newApproved = approved.filter(e => e.id !== eventId);
        localStorage.setItem('approvedEvents', JSON.stringify(newApproved));

        setEvents(events.filter((e) => e.id !== eventId));
        toast.success('Event Deleted', 'The event has been deleted');
        setDeleteModal({ open: false, event: null });
    };

    // Handle Approve
    const handleApprove = (eventId) => {
        const pending = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
        const eventToApprove = pending.find(e => e.id === eventId);

        if (eventToApprove) {
            // Update status
            eventToApprove.status = 'published';

            // Remove from pending
            const newPending = pending.filter(e => e.id !== eventId);
            localStorage.setItem('pendingEvents', JSON.stringify(newPending));

            // Add to approved
            const approved = JSON.parse(localStorage.getItem('approvedEvents') || '[]');
            approved.push(eventToApprove);
            localStorage.setItem('approvedEvents', JSON.stringify(approved));

            toast.success('Event Approved!', 'The event is now visible to all users');
            fetchEvents(); // Refresh
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Status badge
    const getStatusBadge = (status) => {
        const styles = {
            published: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' },
            pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
            draft: { bg: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' },
            cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
        };
        const style = styles[status] || styles.draft;

        return (
            <span
                className="status-badge"
                style={{ background: style.bg, color: style.color }}
            >
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <AnimatedPage className="admin-page admin-events-page">
                <div className="container">
                    <div className="admin-header">
                        <Skeleton height="40px" width="250px" />
                    </div>
                    <div className="events-table-wrapper">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} height="72px" style={{ marginBottom: '0.5rem' }} />
                        ))}
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage className="admin-page admin-events-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="admin-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>Manage Events</h1>
                        <p>{events.length} total events</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/create-event">
                            <AnimatedButton variant="primary" icon={<FiPlus />}>
                                Create Event
                            </AnimatedButton>
                        </Link>
                    </div>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    className="events-toolbar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="search-box">
                        <FiSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="status-filters">
                        {['all', 'published', 'pending', 'draft'].map((status) => (
                            <button
                                key={status}
                                className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Events Table */}
                <motion.div
                    className="events-table-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Attendees</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event) => (
                                <motion.tr
                                    key={event.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                                >
                                    <td>
                                        <div className="event-cell">
                                            <img src={event.image} alt="" className="event-thumb" />
                                            <div>
                                                <span className="event-title">{event.title}</span>
                                                <span className="event-location">
                                                    <FiMapPin size={12} />
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">{event.category}</span>
                                    </td>
                                    <td>{formatDate(event.date)}</td>
                                    <td>{event.price === 0 ? 'Free' : `₹${event.price}`}</td>
                                    <td>
                                        <div className="attendees-cell">
                                            <FiUsers size={14} />
                                            {event.attendees} / {event.capacity}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(event.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {event.status === 'pending' && (
                                                <button
                                                    className="action-btn approve"
                                                    title="Approve Event"
                                                    onClick={() => handleApprove(event.id)}
                                                >
                                                    <FiCheckCircle size={16} />
                                                </button>
                                            )}
                                            <Link to={`/events/${event.id}`} className="action-btn view" title="View Details">
                                                <FiEye size={16} />
                                            </Link>
                                            <Link to={`/admin/events/${event.id}/edit`} className="action-btn edit" title="Edit Event">
                                                <FiEdit2 size={16} />
                                            </Link>
                                            <button
                                                className="action-btn delete"
                                                title="Delete Event"
                                                onClick={() => setDeleteModal({ open: true, event })}
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredEvents.length === 0 && (
                        <div className="no-results">
                            <p>No events found matching "{searchQuery}"</p>
                        </div>
                    )}
                </motion.div>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteModal.open && (
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteModal({ open: false, event: null })}
                        >
                            <motion.div
                                className="modal-content delete-modal"
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="modal-close"
                                    onClick={() => setDeleteModal({ open: false, event: null })}
                                >
                                    <FiX size={20} />
                                </button>

                                <div className="delete-icon">
                                    <FiTrash2 size={32} />
                                </div>

                                <h3>Delete Event?</h3>
                                <p>
                                    Are you sure you want to delete <strong>"{deleteModal.event?.title}"</strong>?
                                    This action cannot be undone.
                                </p>

                                <div className="modal-actions">
                                    <AnimatedButton
                                        variant="secondary"
                                        onClick={() => setDeleteModal({ open: false, event: null })}
                                    >
                                        Cancel
                                    </AnimatedButton>
                                    <AnimatedButton
                                        variant="primary"
                                        onClick={handleDelete}
                                        style={{ background: '#ef4444' }}
                                    >
                                        Delete Event
                                    </AnimatedButton>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default AdminEvents;
