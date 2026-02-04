/**
 * My Bookings Page
 * 
 * Shows user's booking history with:
 * - Animated booking cards
 * - Status indicators
 * - Download tickets option
 */

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiCalendar, FiMapPin, FiDownload, FiExternalLink,
    FiCheck, FiClock, FiAlertCircle
} from 'react-icons/fi';
import { AnimatedPage } from '../components/animations/PageTransition';
import AnimatedButton from '../components/ui/AnimatedButton';
import { BookingCardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import './Bookings.css';

// Sample bookings data
const sampleBookings = [
    {
        id: 'BK20260215001',
        eventId: 1,
        eventTitle: 'Tech Innovation Summit 2026',
        eventImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        date: '2026-03-15',
        time: '9:00 AM',
        location: 'Moscone Center, San Francisco, CA',
        tickets: 2,
        totalAmount: 728,
        status: 'confirmed',
        paymentId: 'pay_xyz123',
        bookingDate: '2026-02-02',
    },
    {
        id: 'BK20260120002',
        eventId: 2,
        eventTitle: 'Sunset Music Festival',
        eventImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        date: '2026-04-20',
        time: '4:00 PM',
        location: 'Hollywood Bowl, Los Angeles, CA',
        tickets: 4,
        totalAmount: 708,
        status: 'confirmed',
        paymentId: 'pay_abc456',
        bookingDate: '2026-01-28',
    },
    {
        id: 'BK20260201003',
        eventId: 3,
        eventTitle: 'Startup Pitch Competition',
        eventImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
        date: '2026-03-28',
        time: '10:00 AM',
        location: 'WeWork, New York, NY',
        tickets: 1,
        totalAmount: 0,
        status: 'pending',
        paymentId: null,
        bookingDate: '2026-02-01',
    },
];

// Status config
const statusConfig = {
    confirmed: {
        label: 'Confirmed',
        icon: FiCheck,
        color: '#22c55e',
        bgColor: 'rgba(34, 197, 94, 0.1)',
    },
    pending: {
        label: 'Pending',
        icon: FiClock,
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    cancelled: {
        label: 'Cancelled',
        icon: FiAlertCircle,
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
    },
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const { toast } = useToast();
    const { user } = useAuth();

    // Load bookings
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            // Load user bookings from localStorage
            const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');

            // Combine with sample data, but prefer local storage for "new" feel
            // Filter out any sample bookings that might conflict by ID (though unlikely with BK prefix vs numerical sample IDs)
            const allBookings = [...localBookings, ...sampleBookings];

            // Remove duplicates just in case
            const uniqueBookings = allBookings.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

            setBookings(uniqueBookings);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Filter bookings by tab
    const filteredBookings = bookings.filter((booking) => {
        const eventDate = new Date(booking.date);
        const today = new Date();

        if (activeTab === 'upcoming') {
            return eventDate >= today && booking.status !== 'cancelled';
        } else if (activeTab === 'past') {
            return eventDate < today;
        } else {
            return booking.status === 'cancelled';
        }
    });

    // Format date
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    // Format currency
    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Generate and download ticket
    const downloadTicket = useCallback((booking) => {
        // Create ticket HTML content
        const ticketHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Event Ticket - ${booking.eventTitle}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .ticket {
            background: white;
            border-radius: 20px;
            max-width: 400px;
            width: 100%;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .ticket-header {
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            color: white;
            padding: 25px;
            text-align: center;
        }
        .ticket-header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .ticket-header p {
            opacity: 0.9;
            font-size: 14px;
        }
        .ticket-body {
            padding: 25px;
        }
        .event-title {
            font-size: 20px;
            font-weight: 700;
            color: #1e1b4b;
            margin-bottom: 20px;
            text-align: center;
        }
        .ticket-info {
            display: grid;
            gap: 15px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding-bottom: 10px;
            border-bottom: 1px dashed #e5e7eb;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            color: #6b7280;
            font-size: 14px;
        }
        .info-value {
            color: #1e1b4b;
            font-weight: 600;
            font-size: 14px;
            text-align: right;
        }
        .qr-section {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 2px dashed #e5e7eb;
        }
        .qr-code {
            width: 120px;
            height: 120px;
            background: #1e1b4b;
            margin: 0 auto 15px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
        .booking-id {
            font-family: monospace;
            font-size: 16px;
            font-weight: 700;
            color: #8b5cf6;
        }
        .ticket-footer {
            background: #1e1b4b;
            color: white;
            padding: 15px 25px;
            text-align: center;
            font-size: 12px;
        }
        .attendee-name {
            color: #8b5cf6;
            font-weight: 700;
        }
        @media print {
            body { background: white; padding: 0; }
            .ticket { box-shadow: none; border: 2px solid #e5e7eb; }
        }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="ticket-header">
            <h1>🎫 EventFlow</h1>
            <p>Your Event Ticket</p>
        </div>
        <div class="ticket-body">
            <h2 class="event-title">${booking.eventTitle}</h2>
            <div class="ticket-info">
                <div class="info-row">
                    <span class="info-label">📅 Date</span>
                    <span class="info-value">${formatDate(booking.date)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">⏰ Time</span>
                    <span class="info-value">${booking.time}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📍 Venue</span>
                    <span class="info-value">${booking.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🎟️ Tickets</span>
                    <span class="info-value">${booking.tickets} ${booking.tickets > 1 ? 'Tickets' : 'Ticket'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">💰 Amount Paid</span>
                    <span class="info-value">${booking.totalAmount > 0 ? formatPrice(booking.totalAmount) : 'FREE'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">👤 Attendee</span>
                    <span class="info-value attendee-name">${booking.userName || user?.name || 'Guest'}</span>
                </div>
            </div>
        </div>
        <div class="qr-section">
            <div class="qr-code">
                <svg width="80" height="80" viewBox="0 0 100 100">
                    <rect x="10" y="10" width="20" height="20" fill="white"/>
                    <rect x="35" y="10" width="10" height="10" fill="white"/>
                    <rect x="50" y="10" width="10" height="10" fill="white"/>
                    <rect x="70" y="10" width="20" height="20" fill="white"/>
                    <rect x="10" y="35" width="10" height="10" fill="white"/>
                    <rect x="45" y="35" width="10" height="10" fill="white"/>
                    <rect x="60" y="35" width="10" height="10" fill="white"/>
                    <rect x="80" y="35" width="10" height="10" fill="white"/>
                    <rect x="10" y="50" width="10" height="10" fill="white"/>
                    <rect x="30" y="50" width="10" height="10" fill="white"/>
                    <rect x="50" y="50" width="10" height="10" fill="white"/>
                    <rect x="80" y="50" width="10" height="10" fill="white"/>
                    <rect x="10" y="70" width="20" height="20" fill="white"/>
                    <rect x="35" y="70" width="10" height="10" fill="white"/>
                    <rect x="55" y="70" width="10" height="10" fill="white"/>
                    <rect x="70" y="70" width="20" height="20" fill="white"/>
                </svg>
            </div>
            <p style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Booking ID</p>
            <p class="booking-id">${booking.id}</p>
        </div>
        <div class="ticket-footer">
            <p>Present this ticket at the venue entrance</p>
            <p style="margin-top: 5px; opacity: 0.7;">Generated on ${new Date().toLocaleDateString('en-IN')}</p>
        </div>
    </div>
    <script>
        // Auto-print when opened
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>`;

        // Create a Blob and download
        const blob = new Blob([ticketHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Open in new tab (for printing) or download
        const link = document.createElement('a');
        link.href = url;
        link.download = `EventFlow-Ticket-${booking.id}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Ticket Downloaded!', 'Open the file to print your ticket');
    }, [toast, user]);

    return (
        <AnimatedPage className="bookings-page">
            <div className="container">
                {/* Header */}
                <motion.div
                    className="bookings-header"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1>My Bookings</h1>
                    <p>Manage your event reservations</p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    className="bookings-tabs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {['upcoming', 'past', 'cancelled'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {activeTab === tab && (
                                <motion.div
                                    className="tab-indicator"
                                    layoutId="tabIndicator"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Bookings List */}
                {loading ? (
                    <div className="bookings-skeleton">
                        {[1, 2, 3].map((i) => (
                            <BookingCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <motion.div
                        className="bookings-list"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        key={activeTab}
                    >
                        {filteredBookings.map((booking) => {
                            const status = statusConfig[booking.status];
                            const StatusIcon = status.icon;

                            return (
                                <motion.div
                                    key={booking.id}
                                    className="booking-card"
                                    variants={itemVariants}
                                    whileHover={{ y: -4 }}
                                >
                                    {/* Event Image */}
                                    <div className="booking-image">
                                        <img src={booking.eventImage} alt={booking.eventTitle} />
                                        <div
                                            className="booking-status"
                                            style={{
                                                backgroundColor: status.bgColor,
                                                color: status.color,
                                            }}
                                        >
                                            <StatusIcon size={14} />
                                            <span>{status.label}</span>
                                        </div>
                                    </div>

                                    {/* Booking Info */}
                                    <div className="booking-info">
                                        <h3 className="booking-title">{booking.eventTitle}</h3>

                                        <div className="booking-meta">
                                            <span>
                                                <FiCalendar size={14} />
                                                {formatDate(booking.date)} at {booking.time}
                                            </span>
                                            <span>
                                                <FiMapPin size={14} />
                                                {booking.location}
                                            </span>
                                        </div>

                                        <div className="booking-details">
                                            <div className="detail-item">
                                                <span className="detail-label">Tickets</span>
                                                <span className="detail-value">{booking.tickets}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Total</span>
                                                <span className="detail-value">
                                                    {booking.totalAmount > 0 ? formatPrice(booking.totalAmount) : 'Free'}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Booking ID</span>
                                                <span className="detail-value booking-id">{booking.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="booking-actions">
                                        {booking.status === 'confirmed' && (
                                            <AnimatedButton
                                                variant="primary"
                                                size="sm"
                                                icon={<FiDownload />}
                                                onClick={() => downloadTicket(booking)}
                                            >
                                                Download Ticket
                                            </AnimatedButton>
                                        )}
                                        <Link to={`/events/${booking.eventId}`}>
                                            <AnimatedButton
                                                variant="secondary"
                                                size="sm"
                                                icon={<FiExternalLink />}
                                            >
                                                View Event
                                            </AnimatedButton>
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        className="no-bookings"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="no-bookings-icon">🎫</div>
                        <h3>No {activeTab} bookings</h3>
                        <p>
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming events. Browse events to find something exciting!"
                                : activeTab === 'past'
                                    ? "You haven't attended any events yet."
                                    : "You don't have any cancelled bookings."}
                        </p>
                        {activeTab === 'upcoming' && (
                            <Link to="/events">
                                <AnimatedButton variant="primary">
                                    Browse Events
                                </AnimatedButton>
                            </Link>
                        )}
                    </motion.div>
                )}
            </div>
        </AnimatedPage>
    );
};

export default Bookings;
