const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getAllUsers,
  getAllBookings,
  getDashboardStats,
  deleteEvent,
  deleteUser,
  updateUserRole
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes below require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Events management
router.get('/events', getAllEvents);
router.delete('/events/:id', deleteEvent);

// Users management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Bookings management
router.get('/bookings', getAllBookings);

module.exports = router;
