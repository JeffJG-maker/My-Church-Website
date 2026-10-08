const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },

        label: {
            type: String,
            required: true,
            default: "UPCOMING EVENT",
        },

        title: {
            type: String,
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        location: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;