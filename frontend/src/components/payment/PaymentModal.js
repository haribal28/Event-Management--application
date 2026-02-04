/**
 * Payment Modal Component
 * 
 * A beautiful, animated payment modal with card payment form:
 * - Event details review
 * - Ticket selection
 * - Card payment form
 * - Payment processing
 * - Success/failure feedback
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiCalendar, FiMapPin, FiCreditCard,
    FiShield, FiAlertCircle, FiMinus, FiPlus,
    FiLock, FiRefreshCw, FiCheck
} from 'react-icons/fi';
import AnimatedButton from '../ui/AnimatedButton';
import { Spinner } from '../ui/Spinner';
import { formatPrice } from '../../services/paymentService';
import './PaymentModal.css';

// Animation variants
const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, scale: 0.95, y: 30, transition: { duration: 0.2 } },
};

const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1, opacity: 1,
        transition: { type: 'spring', stiffness: 200, damping: 15 }
    },
};

const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1, opacity: 1,
        transition: { pathLength: { duration: 0.5, delay: 0.2 }, opacity: { duration: 0.1 } }
    },
};

// Payment states
const PAYMENT_STATES = {
    IDLE: 'idle',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    FAILED: 'failed',
};

const PaymentModal = ({
    isOpen,
    onClose,
    event,
    onPaymentSuccess,
    user = {},
}) => {
    const [ticketCount, setTicketCount] = useState(1);
    const [paymentState, setPaymentState] = useState(PAYMENT_STATES.IDLE);
    const [error, setError] = useState(null);
    const [cardData, setCardData] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
    });
    const [cardErrors, setCardErrors] = useState({});

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setTicketCount(1);
                setPaymentState(PAYMENT_STATES.IDLE);
                setError(null);
                setCardData({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
                setCardErrors({});
            }, 300);
        }
    }, [isOpen]);

    // Calculate totals
    const totalAmount = event ? event.price * ticketCount : 0;
    const convenienceFee = Math.round(totalAmount * 0.02);
    const gst = Math.round((totalAmount + convenienceFee) * 0.18);
    const grandTotal = totalAmount + convenienceFee + gst;

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : v;
    };

    // Format expiry date
    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    // Handle card input changes
    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
        } else if (name === 'expiry') {
            formattedValue = formatExpiry(value.replace('/', ''));
        } else if (name === 'cvv') {
            formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
        }

        setCardData(prev => ({ ...prev, [name]: formattedValue }));
        setCardErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validate card
    const validateCard = () => {
        const errors = {};

        if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 16) {
            errors.cardNumber = 'Valid card number is required';
        }
        if (!cardData.cardName || cardData.cardName.length < 3) {
            errors.cardName = 'Cardholder name is required';
        }
        if (!cardData.expiry || cardData.expiry.length < 5) {
            errors.expiry = 'Valid expiry date is required';
        }
        if (!cardData.cvv || cardData.cvv.length < 3) {
            errors.cvv = 'Valid CVV is required';
        }

        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle payment
    const handlePayment = useCallback(async () => {
        if (!validateCard()) return;
        if (!event) return;

        setPaymentState(PAYMENT_STATES.PROCESSING);
        setError(null);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2500));

            // Payment successful
            setPaymentState(PAYMENT_STATES.SUCCESS);

            // Save booking to localStorage
            const booking = {
                id: `BK${Date.now().toString().slice(-8)}`,
                eventId: event.id,
                eventTitle: event.title,
                eventImage: event.image,
                date: event.date,
                time: event.time || '9:00 AM',
                location: event.location,
                tickets: ticketCount,
                totalAmount: grandTotal,
                status: 'confirmed',
                paymentId: `pay_${Date.now()}`,
                bookingDate: new Date().toISOString().split('T')[0],
                cardLast4: cardData.cardNumber.slice(-4),
                userName: cardData.cardName,
            };

            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            existingBookings.unshift(booking);
            localStorage.setItem('bookings', JSON.stringify(existingBookings));

            // Notify parent after animation
            setTimeout(() => {
                if (onPaymentSuccess) {
                    onPaymentSuccess({
                        bookingId: booking.id,
                        paymentId: booking.paymentId,
                        eventId: event.id,
                        ticketCount,
                        amount: grandTotal,
                    });
                }
            }, 2000);

        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
            setPaymentState(PAYMENT_STATES.FAILED);
        }
    }, [event, ticketCount, grandTotal, cardData, onPaymentSuccess]);

    // Handle retry
    const handleRetry = () => {
        setPaymentState(PAYMENT_STATES.IDLE);
        setError(null);
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    // Get card type
    const getCardType = (number) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'visa';
        if (/^5[1-5]/.test(cleaned)) return 'mastercard';
        if (/^3[47]/.test(cleaned)) return 'amex';
        if (/^6(?:011|5)/.test(cleaned)) return 'discover';
        return '';
    };

    if (!event) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="payment-overlay"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && paymentState === PAYMENT_STATES.IDLE) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        className="payment-modal"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        {paymentState === PAYMENT_STATES.IDLE && (
                            <button className="modal-close" onClick={onClose}>
                                <FiX size={20} />
                            </button>
                        )}

                        <AnimatePresence mode="wait">
                            {/* Success State */}
                            {paymentState === PAYMENT_STATES.SUCCESS ? (
                                <motion.div
                                    key="success"
                                    className="payment-success"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="success-icon"
                                        variants={successVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <svg viewBox="0 0 50 50">
                                            <motion.path
                                                d="M14 27 L22 35 L36 18"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                variants={checkmarkVariants}
                                                initial="hidden"
                                                animate="visible"
                                            />
                                        </svg>
                                    </motion.div>
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Payment Successful!
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Your booking for {event.title} has been confirmed.
                                    </motion.p>
                                    <motion.div
                                        className="success-details"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <div className="detail-row">
                                            <span>Tickets</span>
                                            <span>{ticketCount}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Amount Paid</span>
                                            <span>{formatPrice(grandTotal)}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span>Card</span>
                                            <span>•••• {cardData.cardNumber.slice(-4)}</span>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <AnimatedButton variant="primary" onClick={onClose}>
                                            View My Bookings
                                        </AnimatedButton>
                                    </motion.div>
                                </motion.div>

                            ) : paymentState === PAYMENT_STATES.FAILED ? (
                                /* Failure State */
                                <motion.div
                                    key="failed"
                                    className="payment-failed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <motion.div
                                        className="failed-icon"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 200 }}
                                    >
                                        <FiAlertCircle size={48} />
                                    </motion.div>
                                    <h2>Payment Failed</h2>
                                    <p className="error-message">{error}</p>
                                    <div className="failed-actions">
                                        <AnimatedButton
                                            variant="primary"
                                            icon={<FiRefreshCw />}
                                            onClick={handleRetry}
                                        >
                                            Try Again
                                        </AnimatedButton>
                                        <AnimatedButton variant="secondary" onClick={onClose}>
                                            Cancel
                                        </AnimatedButton>
                                    </div>
                                </motion.div>

                            ) : paymentState === PAYMENT_STATES.PROCESSING ? (
                                /* Processing State */
                                <motion.div
                                    key="processing"
                                    className="payment-processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <Spinner size="lg" />
                                    <h2>Processing Payment...</h2>
                                    <p>Please wait while we process your card</p>
                                    <div className="processing-card">
                                        <FiCreditCard size={24} />
                                        <span>•••• •••• •••• {cardData.cardNumber.slice(-4)}</span>
                                    </div>
                                </motion.div>

                            ) : (
                                /* Idle State - Main Content */
                                <motion.div
                                    key="idle"
                                    className="payment-content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Event Summary */}
                                    <div className="event-summary">
                                        <div className="event-image">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400';
                                                }}
                                            />
                                        </div>
                                        <div className="event-info">
                                            <span className="event-category">{event.category}</span>
                                            <h2 className="event-title">{event.title}</h2>
                                            <div className="event-meta">
                                                <span>
                                                    <FiCalendar size={14} />
                                                    {formatDate(event.date)}
                                                </span>
                                                <span>
                                                    <FiMapPin size={14} />
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ticket Selection */}
                                    <div className="ticket-section">
                                        <h3>Select Tickets</h3>
                                        <div className="ticket-selector">
                                            <div className="ticket-info">
                                                <span className="ticket-type">General Admission</span>
                                                <span className="ticket-price">{formatPrice(event.price)}</span>
                                            </div>
                                            <div className="ticket-controls">
                                                <motion.button
                                                    className="control-btn"
                                                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                                    disabled={ticketCount <= 1}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiMinus />
                                                </motion.button>
                                                <span className="ticket-count">{ticketCount}</span>
                                                <motion.button
                                                    className="control-btn"
                                                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                                                    disabled={ticketCount >= 10}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiPlus />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Payment Form */}
                                    <div className="card-payment-section">
                                        <h3><FiCreditCard /> Card Payment</h3>
                                        <div className="card-form">
                                            <div className="form-group">
                                                <label>Card Number</label>
                                                <div className={`card-input ${cardErrors.cardNumber ? 'error' : ''}`}>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={cardData.cardNumber}
                                                        onChange={handleCardChange}
                                                        maxLength={19}
                                                    />
                                                    <div className="card-type">
                                                        {getCardType(cardData.cardNumber) === 'visa' && (
                                                            <span className="card-brand visa">VISA</span>
                                                        )}
                                                        {getCardType(cardData.cardNumber) === 'mastercard' && (
                                                            <span className="card-brand mastercard">MC</span>
                                                        )}
                                                        {getCardType(cardData.cardNumber) === 'amex' && (
                                                            <span className="card-brand amex">AMEX</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {cardErrors.cardNumber && (
                                                    <span className="error-text">{cardErrors.cardNumber}</span>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label>Cardholder Name</label>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    placeholder="John Doe"
                                                    value={cardData.cardName}
                                                    onChange={handleCardChange}
                                                    className={cardErrors.cardName ? 'error' : ''}
                                                />
                                                {cardErrors.cardName && (
                                                    <span className="error-text">{cardErrors.cardName}</span>
                                                )}
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        name="expiry"
                                                        placeholder="MM/YY"
                                                        value={cardData.expiry}
                                                        onChange={handleCardChange}
                                                        maxLength={5}
                                                        className={cardErrors.expiry ? 'error' : ''}
                                                    />
                                                    {cardErrors.expiry && (
                                                        <span className="error-text">{cardErrors.expiry}</span>
                                                    )}
                                                </div>
                                                <div className="form-group">
                                                    <label>CVV</label>
                                                    <input
                                                        type="password"
                                                        name="cvv"
                                                        placeholder="•••"
                                                        value={cardData.cvv}
                                                        onChange={handleCardChange}
                                                        maxLength={4}
                                                        className={cardErrors.cvv ? 'error' : ''}
                                                    />
                                                    {cardErrors.cvv && (
                                                        <span className="error-text">{cardErrors.cvv}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price Breakdown */}
                                    <div className="price-breakdown">
                                        <div className="price-row">
                                            <span>Subtotal ({ticketCount} tickets)</span>
                                            <span>{formatPrice(totalAmount)}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>Convenience Fee</span>
                                            <span>{formatPrice(convenienceFee)}</span>
                                        </div>
                                        <div className="price-row">
                                            <span>GST (18%)</span>
                                            <span>{formatPrice(gst)}</span>
                                        </div>
                                        <div className="price-row total">
                                            <span>Total</span>
                                            <span>{formatPrice(grandTotal)}</span>
                                        </div>
                                    </div>

                                    {/* Trust Indicators */}
                                    <div className="trust-indicators">
                                        <div className="trust-item">
                                            <FiShield size={16} />
                                            <span>100% Secure Payment</span>
                                        </div>
                                        <div className="trust-item">
                                            <FiLock size={16} />
                                            <span>SSL Encrypted</span>
                                        </div>
                                    </div>

                                    {/* Payment Button */}
                                    <div className="payment-action">
                                        <AnimatedButton
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            icon={<FiCreditCard />}
                                            onClick={handlePayment}
                                        >
                                            Pay {formatPrice(grandTotal)}
                                        </AnimatedButton>
                                    </div>

                                    {/* Test Card Info */}
                                    <div className="test-card-info">
                                        <p><FiCheck size={12} /> Use any 16-digit card number for testing</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PaymentModal;
