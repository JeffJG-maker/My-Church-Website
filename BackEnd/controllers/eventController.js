const Event = require("../models/Event");

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.json(events);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve events",
        });
    }
};

const getEvent = async (req, res) => {
    try {
        const event = await Event.findOne({
            id: Number(req.params.id),
        });

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        res.json(event);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve event",
        });
    }
};

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
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch upcoming event",
        });
    }
};

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
        console.error(error);

        res.status(500).json({
            message: "Failed to create event",
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findOneAndUpdate(
            {
                id: Number(req.params.id),
            },
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
        console.error(error);

        res.status(500).json({
            message: "Failed to update event",
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({
            id: Number(req.params.id),
        });

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        }

        res.json({
            message: "Event deleted successfully",
        });
    } catch (error) {
        console.error(error);

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