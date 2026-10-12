
const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const {
    getMedia,
    uploadMedia,
    deleteMedia,
} = require("../controllers/mediaController");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();

        callback(null, `${crypto.randomUUID()}${extension}`);
    },
});

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
]);

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 10,
    },

    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(
                new Error("Only supported image and video files are allowed.")
            );
        }

        callback(null, true);
    },
});

// GET: Retrieve all media
router.get("/", getMedia);

// POST: Upload media files
router.post("/", (req, res, next) => {
    upload.array("files", 10)(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        next();
    });
}, uploadMedia);

// DELETE: Delete a media file
router.delete("/:id", deleteMedia);

module.exports = router;
