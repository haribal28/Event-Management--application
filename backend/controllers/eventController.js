const Event = require("../models/Event");

// Create Event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            data: event,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Events (PUBLIC)
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("createdBy", "name email");

        res.json({
            success: true,
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get My Events (LOGGED-IN USER)
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user.id });

        res.json({
            success: true,
            data: events,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getMyEvents,
};
