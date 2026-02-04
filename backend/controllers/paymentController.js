/**
 * Payment Controller
 * 
 * Handles payment operations:
 * - Create Razorpay order
 * - Verify payment signature
 * - Update booking status
 */

const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance (use environment variables in production)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET',
});

/**
 * Create a new payment order
 * POST /api/payments/create-order
 */
const createOrder = async (req, res) => {
    try {
        const { eventId, ticketCount, amount, currency = 'INR' } = req.body;

        // Validate input
        if (!eventId || !ticketCount || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: eventId, ticketCount, amount',
            });
        }

        // Create order options
        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: currency,
            receipt: `booking_${eventId}_${Date.now()}`,
            notes: {
                eventId: eventId.toString(),
                ticketCount: ticketCount.toString(),
            },
        };

        // Create Razorpay order
        const order = await razorpay.orders.create(options);

        // Create a pending booking in database (to be implemented)
        const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // TODO: Save booking to database with status 'pending'
        // const booking = await Booking.create({
        //   userId: req.user.id,
        //   eventId,
        //   ticketCount,
        //   amount,
        //   orderId: order.id,
        //   status: 'pending',
        // });

        res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount / 100, // Convert back to rupees for display
                currency: order.currency,
                receipt: order.receipt,
            },
            bookingId: bookingId,
        });

    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order',
            error: error.message,
        });
    }
};

/**
 * Verify payment after successful transaction
 * POST /api/payments/verify
 */
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
        } = req.body;

        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification data',
            });
        }

        // Verify signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed - Invalid signature',
            });
        }

        // TODO: Update booking status in database
        // await Booking.findByIdAndUpdate(bookingId, {
        //   status: 'confirmed',
        //   paymentId: razorpay_payment_id,
        //   paidAt: new Date(),
        // });

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            bookingId: bookingId,
            paymentId: razorpay_payment_id,
        });

    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed',
            error: error.message,
        });
    }
};

/**
 * Get payment details by order ID
 * GET /api/payments/order/:orderId
 */
const getPaymentByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        const payments = await razorpay.orders.fetchPayments(orderId);

        res.status(200).json({
            success: true,
            payments: payments.items,
        });

    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment details',
            error: error.message,
        });
    }
};

/**
 * Handle Razorpay webhook events
 * POST /api/payments/webhook
 */
const handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';

        // Verify webhook signature
        const signature = req.headers['x-razorpay-signature'];
        const body = JSON.stringify(req.body);

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        if (signature !== expectedSignature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const event = req.body.event;
        const payload = req.body.payload;

        switch (event) {
            case 'payment.captured':
                // Payment was successful
                console.log('Payment captured:', payload.payment.entity.id);
                // TODO: Update booking status
                break;

            case 'payment.failed':
                // Payment failed
                console.log('Payment failed:', payload.payment.entity.id);
                // TODO: Update booking status or notify user
                break;

            case 'refund.created':
                // Refund was initiated
                console.log('Refund created:', payload.refund.entity.id);
                // TODO: Update booking status
                break;

            default:
                console.log('Unhandled webhook event:', event);
        }

        res.status(200).json({ success: true, received: true });

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
};

/**
 * Initiate refund
 * POST /api/payments/refund
 */
const initiateRefund = async (req, res) => {
    try {
        const { paymentId, amount, reason } = req.body;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Payment ID is required',
            });
        }

        const refundOptions = {
            speed: 'normal',
            notes: {
                reason: reason || 'Customer requested refund',
            },
        };

        // If partial refund, add amount
        if (amount) {
            refundOptions.amount = Math.round(amount * 100);
        }

        const refund = await razorpay.payments.refund(paymentId, refundOptions);

        // TODO: Update booking status in database
        // await Booking.findOneAndUpdate(
        //   { paymentId },
        //   { status: 'refunded', refundId: refund.id }
        // );

        res.status(200).json({
            success: true,
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                status: refund.status,
            },
        });

    } catch (error) {
        console.error('Error initiating refund:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate refund',
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    getPaymentByOrderId,
    handleWebhook,
    initiateRefund,
};
