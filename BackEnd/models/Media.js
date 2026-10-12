
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        filename: {
            type: String,
            required: true,
            unique: true,
        },
        url: {
            type: String,
            required: true,
        },
        kind: {
            type: String,
            enum: ["image", "video"],
            required: true,
        },
        type: {
            type: String,
            default: "application/octet-stream",
        },
        size: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
