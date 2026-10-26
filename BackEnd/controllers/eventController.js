const Event = require("../models/Event");

// Get all events
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);

        res.status(500).json({
            message: "Failed to retrieve events",
        });
    }
};

// Get a single event by ID
const getEvent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Validate the ID before querying MongoDB
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid event ID",
            });
        }

        const event = await Event.findOne({ id });

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);

        res.status(500).json({
            message: "Failed to retrieve event",
        });
    }
};

// Get the next upcoming published event
const getUpcomingEvent = async (req, res) => {
    try {
        const event = await Event.findOne({
            isPublished: true,
            date: { $gte: new Date() },
        }).sort({ date: 1 });

        if (!event) {
            return res.status(404).json({
                message: "No upcoming event found",
            });
        }

        res.json(event);
    } catch (error) {
        console.error("Error fetching upcoming event:", error);

        res.status(500).json({
            message: "Failed to fetch upcoming event",
        });
    }
};

// Create a new event
const createEvent = async (req, res) => {
    try {
        const event = await Event.create({
            id: Date.now(),
            label: req.body.label || "UPCOMING EVENT",
            title: req.body.title,
            date: req.body.date,
            time: req.body.time,
            location: req.body.location,
            description: req.body.description || "",
            image: req.body.image || "",
            isPublished:
                req.body.isPublished !== undefined
                    ? req.body.isPublished
                    : true,
        });

        res.status(201).json(event);
    } catch (error) {
        console.error("Error creating event:", error);

        res.status(500).json({
            message: "Failed to create event",
        });
    }
};

// Update an existing event
const updateEvent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Validate the ID before querying MongoDB
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid event ID",
            });
        }

        const event = await Event.findOneAndUpdate(
            { id },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        res.json(event);
    } catch (error) {
        console.error("Error updating event:", error);

        res.status(500).json({
            message: "Failed to update event",
        });
    }
};

// Delete an event
const deleteEvent = async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Validate the ID before querying MongoDB
        if (!Number.isSafeInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid event ID",
            });
        }

        const event = await Event.findOneAndDelete({ id });

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        res.json({
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting event:", error);

        res.status(500).json({
            message: "Failed to delete event",
        });
    }
};

module.exports = {
    getEvents,
    getEvent,
    getUpcomingEvent,
    createEvent,
    updateEvent,
    deleteEvent,
};