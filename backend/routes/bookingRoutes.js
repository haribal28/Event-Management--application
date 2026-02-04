const express = require("express");
const router = express.Router();

const {
    bookEvent,
    getMyBookings,
    adminUpdateBooking,
    adminDeleteBooking
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/auth");

// Book an event (logged-in user)
router.post("/", protect, bookEvent);

// Get my bookings (logged-in user)
router.get("/my", protect, getMyBookings);

// Admin routes for booking management
router.put("/admin/:id", protect, authorize('admin'), adminUpdateBooking);
router.delete("/admin/:id", protect, authorize('admin'), adminDeleteBooking);

module.exports = router;

