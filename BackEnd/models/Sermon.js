const mongoose = require("mongoose");

const sermonSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    speaker: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    videoUrl: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    duration: {
        type: String,
        required: true
    }
});

const Sermon = mongoose.model("Sermon", sermonSchema);

module.exports = Sermon;

