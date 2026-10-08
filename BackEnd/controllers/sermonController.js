const path = require("path");
const fs = require("fs");

const Sermon = require("../models/Sermon");

const getSermons = async (req, res) => {
    try {
        const sermons = await Sermon.find().sort({ date: -1 });

        res.json(sermons);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve sermons",
        });
    }
};

const getSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findOne({
            id: Number(req.params.id),
        });

        if (!sermon) {
            return res.status(404).json({
                message: "Sermon not found",
            });
        }

        res.json(sermon);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve sermon",
        });
    }
};

const getLatestSermons = async (req, res) => {
    try {
        const sermons = await Sermon.find()
            .sort({ date: -1 })
            .limit(4);

        res.json(sermons);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch latest sermons",
        });
    }
};

/*
 * DOWNLOAD SERMON MEDIA
 */
const downloadSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findOne({
            id: Number(req.params.id),
        });

        if (!sermon) {
            return res.status(404).json({
                message: "Sermon not found",
            });
        }

        if (!sermon.mediaUrl) {
            return res.status(404).json({
                message: "No media file is available for this sermon",
            });
        }

        /*
         * mediaUrl example:
         *
         * uploads/videos/The Great Commission.mp4
         *
         * We convert that into the actual file path
         * inside the BackEnd folder.
         */
        const filePath = path.join(
            __dirname,
            "..",
            sermon.mediaUrl
        );

        /*
         * Make sure the file actually exists.
         */
        if (!fs.existsSync(filePath)) {
            console.error(
                "Download file not found:",
                filePath
            );

            return res.status(404).json({
                message: "Sermon media file not found",
            });
        }

        /*
         * Get the original filename.
         */
        const fileName = path.basename(filePath);

        /*
         * Force the browser to download the file
         * instead of opening it.
         */
        res.download(
            filePath,
            fileName,
            (error) => {
                if (error) {
                    console.error(
                        "Sermon download error:",
                        error
                    );

                    if (!res.headersSent) {
                        res.status(500).json({
                            message:
                                "Failed to download sermon",
                        });
                    }
                }
            }
        );
    } catch (error) {
        console.error(
            "Download sermon error:",
            error
        );

        res.status(500).json({
            message: "Failed to download sermon",
        });
    }
};

const createSermon = async (req, res) => {
    try {
        const thumbnail = req.files?.thumbnail?.[0];
        const video = req.files?.video?.[0];
        const audio = req.files?.audio?.[0];

        if (!thumbnail) {
            return res.status(400).json({
                message: "Sermon thumbnail is required",
            });
        }

        const type = req.body.type?.toLowerCase();

        if (!type || !["video", "audio"].includes(type)) {
            return res.status(400).json({
                message:
                    "Sermon type must be either video or audio",
            });
        }

        let mediaUrl = "";

        if (type === "video") {
            if (!video) {
                return res.status(400).json({
                    message:
                        "Video file is required for a video sermon",
                });
            }

            mediaUrl = `uploads/videos/${video.filename}`;
        }

        if (type === "audio") {
            if (!audio) {
                return res.status(400).json({
                    message:
                        "Audio file is required for an audio sermon",
                });
            }

            mediaUrl = `uploads/audio/${audio.filename}`;
        }

        const sermon = await Sermon.create({
            id: Date.now(),
            title: req.body.title,
            speaker: req.body.speaker,
            category: req.body.category,
            description: req.body.description,
            date: req.body.date,
            thumbnail: `uploads/thumbnails/${thumbnail.filename}`,
            mediaUrl,
            type,
        });

        res.status(201).json(sermon);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create sermon",
        });
    }
};

const updateSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findOneAndUpdate(
            {
                id: Number(req.params.id),
            },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!sermon) {
            return res.status(404).json({
                message: "Sermon not found",
            });
        }

        res.json(sermon);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update sermon",
        });
    }
};

const deleteSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findOneAndDelete({
            id: Number(req.params.id),
        });

        if (!sermon) {
            return res.status(404).json({
                message: "Sermon not found",
            });
        }

        res.json({
            message: "Sermon deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete sermon",
        });
    }
};

module.exports = {
    getSermons,
    getSermon,
    getLatestSermons,
    downloadSermon,
    createSermon,
    updateSermon,
    deleteSermon,
};