const express = require("express");
const router = express.Router();
const {
    createEvent,
    getEvents,
    getMyEvents,
} = require("../controllers/eventController");
const { protect } = require("../middleware/auth");

// Public – view all events
router.get("/", getEvents);

// Protected – create event
router.post("/", protect, createEvent);

// Protected – view my events
router.get("/my", protect, getMyEvents);

module.exports = router;
