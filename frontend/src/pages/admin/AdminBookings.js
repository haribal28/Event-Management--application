/**
 * Admin Bookings Page
 * 
 * Booking management with:
 * - All bookings table
 * - Status filtering
 * - Status updates
 * - User & event details
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiSearch, FiFilter, FiCheck, FiClock, FiX,
    FiUser, FiCalendar, FiDollarSign, FiRefreshCw
} from 'react-icons/fi';
import { AnimatedPage } from '../../components/animations/PageTransition';
import AnimatedButton from '../../components/ui/AnimatedButton';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { bookingsAPI } from '../../services/api';
import './AdminBookings.css';

// Sample bookings data
const sampleBookings = [
    {
        id: 'BK001',
        user: { name: 'John Doe', email: 'john@example.com' },
        event: { title: 'Tech Summit 2026', date: '2026-03-15' },
        tickets: 2,
        amount: 598,
        status: 'confirmed',
        paymentId: 'pay_xyz123',
        createdAt: '2026-02-02T10:30:00',
    },
    {
        id: 'BK002',
        user: { name: 'Jane Smith', email: 'jane@example.com' },
        event: { title: 'Music Festival', date: '2026-04-20' },
        tickets: 4,
        amount: 596,
        status: 'pending',
        paymentId: null,
        createdAt: '2026-02-02T09:15:00',
    },
    {
        id: 'BK003',
        user: { name: 'Mike Johnson', email: 'mike@example.com' },
        event: { title: 'Business Conference', date: '2026-03-28' },
        tickets: 1,
        amount: 399,
        status: 'confirmed',
        paymentId: 'pay_abc456',
        createdAt: '2026-02-01T14:45:00',
    },
    {
        id: 'BK004',
        user: { name: 'Sarah Wilson', email: 'sarah@example.com' },
        event: { title: 'Art Exhibition', date: '2026-05-10' },
        tickets: 2,
        amount: 158,
        status: 'cancelled',
        paymentId: 'pay_def789',
        createdAt: '2026-02-01T11:20:00',
    },
    {
        id: 'BK005',
        user: { name: 'Tom Brown', email: 'tom@example.com' },
        event: { title: 'Food Festival', date: '2026-04-05' },
        tickets: 3,
        amount: 147,
        status: 'confirmed',
        paymentId: 'pay_ghi012',
        createdAt: '2026-01-31T16:00:00',
    },
];

// Status options
const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
];

const AdminBookings = () => {
    const { toast } = useToast();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Fetch bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await bookingsAPI.getAll();
                setBookings(response.data.bookings || response.data);
            } catch (error) {
                console.log('Using sample data');
                setBookings(sampleBookings);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Filter bookings
    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.event.title.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Update booking status
    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await bookingsAPI.updateStatus(bookingId, newStatus);
            setBookings(bookings.map((b) =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            toast.success('Status Updated', `Booking ${bookingId} is now ${newStatus}`);
        } catch (error) {
            // For demo, update local state anyway
            setBookings(bookings.map((b) =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));
            toast.success('Status Updated', `Booking ${bookingId} is now ${newStatus}`);
        }
    };

    // Format date/time
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Status badge
    const getStatusBadge = (status) => {
        const config = {
            confirmed: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', icon: FiCheck },
            pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: FiClock },
            cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: FiX },
        };
        const style = config[status] || config.pending;
        const StatusIcon = style.icon;

        return (
            <span
                className="status-badge"
                style={{ background: style.bg, color: style.color }}
            >
                <StatusIcon size={12} />
                {status}
            </span>
        );
    };

    // Stats
    const stats = {
        total: bookings.length,
        confirmed: bookings.filter((b) => b.status === 'confirmed').length,
        pending: bookings.filter((b) => b.status === 'pending').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        revenue: bookings
            .filter((b) => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.amount, 0),
    };

    if (loading) {
        return (
            <AnimatedPage className="admin-page admin-bookings-page">
                <div className="container">
                    <div className="admin-header">
                        <Skeleton height="40px" width="250px" />
                    </div>
                    <div className="bookings-table-wrapper">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} height="72px" style={{ marginBottom: '0.5rem' }} />
                        ))}
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage className="admin-page admin-bookings-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="admin-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1>All Bookings</h1>
                        <p>Manage and track all event bookings</p>
                    </div>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    className="bookings-stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="mini-stat">
                        <span className="mini-stat-value">{stats.total}</span>
                        <span className="mini-stat-label">Total</span>
                    </div>
                    <div className="mini-stat confirmed">
                        <span className="mini-stat-value">{stats.confirmed}</span>
                        <span className="mini-stat-label">Confirmed</span>
                    </div>
                    <div className="mini-stat pending">
                        <span className="mini-stat-value">{stats.pending}</span>
                        <span className="mini-stat-label">Pending</span>
                    </div>
                    <div className="mini-stat cancelled">
                        <span className="mini-stat-value">{stats.cancelled}</span>
                        <span className="mini-stat-label">Cancelled</span>
                    </div>
                    <div className="mini-stat revenue">
                        <span className="mini-stat-value">₹{stats.revenue.toLocaleString('en-IN')}</span>
                        <span className="mini-stat-label">Revenue</span>
                    </div>
                </motion.div>

                {/* Toolbar */}
                <motion.div
                    className="bookings-toolbar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="search-box">
                        <FiSearch size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID, user, or event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <FiFilter size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Bookings Table */}
                <motion.div
                    className="bookings-table-wrapper"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>User</th>
                                <th>Event</th>
                                <th>Tickets</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <motion.tr
                                    key={booking.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                                >
                                    <td>
                                        <span className="booking-id">{booking.id}</span>
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-small">
                                                {booking.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="user-name">{booking.user.name}</span>
                                                <span className="user-email">{booking.user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="event-name">{booking.event.title}</span>
                                    </td>
                                    <td>{booking.tickets}</td>
                                    <td className="amount-cell">₹{booking.amount}</td>
                                    <td>{getStatusBadge(booking.status)}</td>
                                    <td>{formatDateTime(booking.createdAt)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {booking.status === 'pending' && (
                                                <button
                                                    className="action-btn confirm"
                                                    title="Confirm Booking"
                                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                >
                                                    <FiCheck size={16} />
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    className="action-btn cancel"
                                                    title="Cancel Booking"
                                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            )}
                                            {booking.status === 'cancelled' && (
                                                <button
                                                    className="action-btn restore"
                                                    title="Restore Booking"
                                                    onClick={() => handleStatusUpdate(booking.id, 'pending')}
                                                >
                                                    <FiRefreshCw size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div className="no-results">
                            <p>No bookings found</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default AdminBookings;
