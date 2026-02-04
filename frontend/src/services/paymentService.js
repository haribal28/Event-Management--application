/**
 * Payment Service
 * 
 * Handles payment operations with Razorpay.
 * Includes demo mode for testing without backend/Razorpay.
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Razorpay test key (public key only - safe to expose)
const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';

// Demo mode - set to true to bypass Razorpay and simulate payments
const DEMO_MODE = true;

/**
 * Load Razorpay SDK script dynamically
 */
export const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
        // In demo mode, skip loading Razorpay
        if (DEMO_MODE) {
            resolve(true);
            return;
        }

        // Check if already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(script);
    });
};

/**
 * Create a payment order on the backend
 */
export const createPaymentOrder = async (bookingDetails) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payments/create-order`, {
            eventId: bookingDetails.eventId,
            ticketCount: bookingDetails.ticketCount,
            amount: bookingDetails.amount,
            currency: bookingDetails.currency || 'INR',
        });

        return response.data;
    } catch (error) {
        console.error('Error creating payment order:', error);
        throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
};

/**
 * Verify payment on the backend after successful payment
 */
export const verifyPayment = async (paymentData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/payments/verify`, {
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
            bookingId: paymentData.bookingId,
        });

        return response.data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
};

/**
 * Initialize and open Razorpay checkout (or simulate in demo mode)
 */
export const initiatePayment = async (options) => {
    const {
        orderId,
        amount,
        currency = 'INR',
        eventTitle,
        eventImage,
        userEmail,
        userName,
        userPhone,
        onSuccess,
        onFailure,
        onDismiss,
    } = options;

    // DEMO MODE: Simulate payment success after a delay
    if (DEMO_MODE) {
        console.log('🔶 DEMO MODE: Simulating payment...');

        // Simulate payment processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate successful payment
        if (onSuccess) {
            onSuccess({
                razorpay_payment_id: `pay_demo_${Date.now()}`,
                razorpay_order_id: orderId,
                razorpay_signature: `sig_demo_${Date.now()}`,
            });
        }
        return;
    }

    // Production mode: Use real Razorpay
    try {
        await loadRazorpayScript();
    } catch (error) {
        onFailure(error);
        return;
    }

    // Razorpay checkout options
    const razorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: currency,
        name: 'EventFlow',
        description: `Booking for ${eventTitle}`,
        image: eventImage || '/logo192.png',
        order_id: orderId,
        prefill: {
            name: userName || '',
            email: userEmail || '',
            contact: userPhone || '',
        },
        theme: {
            color: '#8b5cf6', // Purple to match our design
            backdrop_color: 'rgba(2, 6, 23, 0.9)',
        },
        modal: {
            ondismiss: () => {
                if (onDismiss) onDismiss();
            },
            escape: true,
            animation: true,
        },
        handler: function (response) {
            // Payment successful - verify on backend
            if (onSuccess) {
                onSuccess({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                });
            }
        },
    };

    // Create Razorpay instance and open checkout
    try {
        const razorpay = new window.Razorpay(razorpayOptions);

        razorpay.on('payment.failed', function (response) {
            if (onFailure) {
                onFailure({
                    code: response.error.code,
                    description: response.error.description,
                    source: response.error.source,
                    step: response.error.step,
                    reason: response.error.reason,
                });
            }
        });

        razorpay.open();
    } catch (error) {
        if (onFailure) {
            onFailure(error);
        }
    }
};

/**
 * Format price for display
 */
export const formatPrice = (amount, currency = 'INR') => {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    });
    return formatter.format(amount);
};

/**
 * Create a mock order for testing (when backend isn't available)
 */
export const createMockOrder = (bookingDetails) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const bookingId = `BK${Date.now().toString().slice(-8)}`;

            resolve({
                success: true,
                order: {
                    id: `order_${Date.now()}`,
                    amount: bookingDetails.amount,
                    currency: bookingDetails.currency || 'INR',
                    receipt: `booking_${bookingDetails.eventId}_${Date.now()}`,
                },
                bookingId: bookingId,
            });

            // Store booking in localStorage for demo purposes
            const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            const newBooking = {
                id: bookingId,
                eventId: bookingDetails.eventId,
                ticketCount: bookingDetails.ticketCount,
                amount: bookingDetails.amount,
                status: 'confirmed',
                createdAt: new Date().toISOString(),
            };
            existingBookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(existingBookings));

        }, 800);
    });
};

const paymentService = {
    loadRazorpayScript,
    createPaymentOrder,
    verifyPayment,
    initiatePayment,
    formatPrice,
    createMockOrder,
};

export default paymentService;
