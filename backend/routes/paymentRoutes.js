/**
 * Payment Routes
 * 
 * Routes for handling payment operations with Razorpay
 */

const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getPaymentByOrderId,
    handleWebhook,
    initiateRefund,
} = require('../controllers/paymentController');

// Middleware for authentication (to be implemented)
// const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/payments/create-order
 * @desc    Create a new Razorpay order for payment
 * @access  Private (requires authentication)
 */
router.post('/create-order', /* protect, */ createOrder);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify payment after successful transaction
 * @access  Private (requires authentication)
 */
router.post('/verify', /* protect, */ verifyPayment);

/**
 * @route   GET /api/payments/order/:orderId
 * @desc    Get payment details by order ID
 * @access  Private (requires authentication)
 */
router.get('/order/:orderId', /* protect, */ getPaymentByOrderId);

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Razorpay webhook events
 * @access  Public (verified by signature)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

/**
 * @route   POST /api/payments/refund
 * @desc    Initiate a refund for a payment
 * @access  Private (requires admin or owner)
 */
router.post('/refund', /* protect, */ initiateRefund);

module.exports = router;
