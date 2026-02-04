/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard with:
 * - Stats overview cards
 * - Recent bookings
 * - Quick actions
 * - Charts placeholder
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiUsers, FiCalendar, FiBookmark, FiDollarSign,
    FiTrendingUp, FiArrowRight, FiCheck, FiClock
} from 'react-icons/fi';
import { AnimatedPage } from '../../components/animations/PageTransition';
import AnimatedButton from '../../components/ui/AnimatedButton';
import { Skeleton } from '../../components/ui/Skeleton';
import { adminAPI } from '../../services/api';
import './AdminDashboard.css';

// Stats card animation
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

// Sample stats data (for demo when API isn't connected)
const sampleStats = {
    totalUsers: 1247,
    totalEvents: 89,
    totalBookings: 3456,
    totalRevenue: 234500,
    userGrowth: 12.5,
    eventGrowth: 8.3,
    bookingGrowth: 23.1,
    revenueGrowth: 18.7,
};

// Sample recent bookings
const sampleRecentBookings = [
    { id: 1, user: 'John Doe', event: 'Tech Summit 2026', amount: 299, status: 'confirmed', date: '2026-02-02' },
    { id: 2, user: 'Jane Smith', event: 'Music Festival', amount: 149, status: 'pending', date: '2026-02-02' },
    { id: 3, user: 'Mike Johnson', event: 'Business Conference', amount: 399, status: 'confirmed', date: '2026-02-01' },
    { id: 4, user: 'Sarah Wilson', event: 'Art Exhibition', amount: 79, status: 'confirmed', date: '2026-02-01' },
    { id: 5, user: 'Tom Brown', event: 'Food Festival', amount: 49, status: 'cancelled', date: '2026-01-31' },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try to fetch from API if available
                const response = await adminAPI.getStats();
                setStats(response.data);
            } catch (error) {
                // FALLBACK: Use localStorage for Demo Mode
                const pendingEvents = JSON.parse(localStorage.getItem('pendingEvents') || '[]');
                const approvedEvents = JSON.parse(localStorage.getItem('approvedEvents') || '[]');
                const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

                // Calculate real values from storage
                const totalRev = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

                setStats({
                    ...sampleStats,
                    totalEvents: 89 + approvedEvents.length,
                    pendingEvents: pendingEvents.length,
                    totalBookings: 3456 + bookings.length,
                    totalRevenue: 234500 + totalRev
                });

                // Get recent bookings from storage
                if (bookings.length > 0) {
                    const recent = bookings.slice(0, 5).map(b => ({
                        id: b.id,
                        user: b.userName || 'Demo User',
                        event: b.eventTitle,
                        amount: b.totalAmount,
                        status: b.status,
                        date: b.bookingDate
                    }));
                    setRecentBookings([...recent, ...sampleRecentBookings.slice(0, 5 - recent.length)]);
                } else {
                    setRecentBookings(sampleRecentBookings);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statsCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            growth: stats?.userGrowth || 0,
            icon: FiUsers,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)',
        },
        {
            title: 'Total Events',
            value: stats?.totalEvents || 0,
            growth: stats?.eventGrowth || 0,
            icon: FiCalendar,
            color: '#06b6d4',
            bgColor: 'rgba(6, 182, 212, 0.1)',
        },
        {
            title: 'Total Bookings',
            value: stats?.totalBookings || 0,
            growth: stats?.bookingGrowth || 0,
            icon: FiBookmark,
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.1)',
        },
        {
            title: 'Pending Approvals',
            value: stats?.pendingEvents || 0,
            growth: 0,
            icon: FiClock,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
        },
        {
            title: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
            growth: stats?.revenueGrowth || 0,
            icon: FiDollarSign,
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.1)',
        },
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            confirmed: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', icon: FiCheck },
            pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', icon: FiClock },
            cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', icon: FiClock },
        };
        const style = styles[status] || styles.pending;
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

    if (loading) {
        return (
            <AnimatedPage className="admin-page">
                <div className="container">
                    <div className="admin-header">
                        <Skeleton height="40px" width="300px" />
                        <Skeleton height="20px" width="200px" />
                    </div>
                    <div className="stats-grid">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} height="140px" borderRadius="1rem" />
                        ))}
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage className="admin-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="admin-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back! Here's what's happening with your platform.</p>
                    </div>
                    <div className="header-actions">
                        <Link to="/admin/events">
                            <AnimatedButton variant="primary" icon={<FiCalendar />}>
                                Manage Events
                            </AnimatedButton>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            className="stat-card"
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ y: -4 }}
                        >
                            <div className="stat-icon" style={{ background: stat.bgColor }}>
                                <stat.icon size={24} style={{ color: stat.color }} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-title">{stat.title}</span>
                                <span className="stat-value">{stat.value.toLocaleString?.() || stat.value}</span>
                                <span className="stat-growth" style={{ color: stat.growth >= 0 ? '#22c55e' : '#ef4444' }}>
                                    <FiTrendingUp size={14} />
                                    {stat.growth >= 0 ? '+' : ''}{stat.growth}% from last month
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="admin-content">
                    {/* Recent Bookings */}
                    <motion.div
                        className="admin-card recent-bookings"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="card-header">
                            <h2>Recent Bookings</h2>
                            <Link to="/admin/bookings" className="view-all">
                                View All <FiArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="bookings-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Event</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(recentBookings.length > 0 ? recentBookings : sampleRecentBookings).map((booking) => (
                                        <tr key={booking.id}>
                                            <td>{booking.user}</td>
                                            <td className="event-name">{booking.event}</td>
                                            <td>₹{booking.amount}</td>
                                            <td>{getStatusBadge(booking.status)}</td>
                                            <td>{formatDate(booking.date)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        className="admin-card quick-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="card-header">
                            <h2>Quick Actions</h2>
                        </div>
                        <div className="actions-grid">
                            <Link to="/create-event" className="action-item">
                                <div className="action-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                                    <FiCalendar size={20} style={{ color: '#8b5cf6' }} />
                                </div>
                                <span>Create Event</span>
                            </Link>
                            <Link to="/admin/events" className="action-item">
                                <div className="action-icon" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
                                    <FiCalendar size={20} style={{ color: '#06b6d4' }} />
                                </div>
                                <span>Manage Events</span>
                            </Link>
                            <Link to="/admin/events" className="action-item" onClick={() => localStorage.setItem('admin_filter', 'pending')}>
                                <div className="action-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                                    <FiClock size={20} style={{ color: '#f59e0b' }} />
                                </div>
                                <span>Pending Approvals</span>
                            </Link>
                            <Link to="/admin/bookings" className="action-item">
                                <div className="action-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                                    <FiBookmark size={20} style={{ color: '#22c55e' }} />
                                </div>
                                <span>View Bookings</span>
                            </Link>
                            <Link to="/admin/users" className="action-item">
                                <div className="action-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                                    <FiUsers size={20} style={{ color: '#f59e0b' }} />
                                </div>
                                <span>Manage Users</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AdminDashboard;
