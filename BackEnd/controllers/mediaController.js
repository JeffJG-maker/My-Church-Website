
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const Media = require("../models/Media");

const uploadDirectory = path.join(__dirname, "../uploads");

const getMedia = async (req, res) => {
    try {
        const items = await Media.find().sort({ createdAt: -1 });

        res.json({ success: true, items });
    } catch (error) {
        console.error("Get media error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve media.",
        });
    }
};

const uploadMedia = async (req, res) => {
    const files = req.files || [];

    if (!files.length) {
        return res.status(400).json({
            success: false,
            message: "Please select at least one file.",
        });
    }

    try {
        const records = files.map((file) => ({
            name: file.originalname,
            filename: file.filename,
            url: `/uploads/${file.filename}`,
            kind: file.mimetype.startsWith("image/") ? "image" : "video",
            type: file.mimetype,
            size: file.size,
        }));

        const items = await Media.insertMany(records);

        return res.status(201).json({
            success: true,
            message: "Media uploaded successfully.",
            items,
        });
    } catch (error) {
        await Promise.all(
            files.map((file) => fs.unlink(file.path).catch(() => { }))
        );

        console.error("Upload media error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to save uploaded media.",
        });
    }
};

const deleteMedia = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid media ID.",
        });
    }

    try {
        const item = await Media.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Media not found.",
            });
        }

        await Media.deleteOne({ _id: item._id });

        const filename = path.basename(item.filename);
        const filePath = path.join(uploadDirectory, filename);

        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== "ENOENT") {
                console.error("Media file cleanup error:", error);
            }
        }

        return res.json({
            success: true,
            message: "Media deleted successfully.",
        });
    } catch (error) {
        console.error("Delete media error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete media.",
        });
    }
};

module.exports = {
    getMedia,
    uploadMedia,
    deleteMedia,
};
