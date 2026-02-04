const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Book an event
const bookEvent = async (req, res) => {
    try {
        const { eventId } = req.body;

        // Check event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Prevent duplicate booking
        const existingBooking = await Booking.findOne({
            user: req.user.id,
            event: eventId,
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "You already booked this event",
            });
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            event: eventId,
        });

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get my bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user.id,
        }).populate("event");

        res.json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Admin: Update booking status
const adminUpdateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['booked', 'cancelled', 'confirmed', 'attended'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
            });
        }

        // Find booking
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update booking
        if (status) booking.status = status;
        await booking.save();

        // Populate and return updated booking
        const updatedBooking = await Booking.findById(id)
            .populate('user', 'name email')
            .populate('event', 'title date location');

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully',
            data: updatedBooking
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// Admin: Delete booking
const adminDeleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

module.exports = {
    bookEvent,
    getMyBookings,
    adminUpdateBooking,
    adminDeleteBooking
};
