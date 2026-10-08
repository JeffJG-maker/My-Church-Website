const express = require("express");

const router = express.Router();

const {
    getEvents,
    getEvent,
    getUpcomingEvent,
    createEvent,
    updateEvent,
    deleteEvent,
} = require("../controllers/eventController");

router.get("/", getEvents);

router.get("/upcoming", getUpcomingEvent);

router.get("/:id", getEvent);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;