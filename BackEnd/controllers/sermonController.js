const Sermon = require("../models/Sermon");

const getSermons = async (req, res) => {
    try {
        const sermons = await Sermon.find();

        res.json(sermons);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve sermons"
        });
    }
};

const getSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findOne({
            id: Number(req.params.id)
        });

        if (!sermon) {
            return res.status(404).json({
                message: "Sermon not found"
            });
        }

        res.json(sermon);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve sermon"
        });
    }
};

const createSermon = async (req, res) => {
    // try {
    //     const lastSermon = await Sermon
    //         .findOne({ id: { $exists: true } })
    //         .sort({ id: -1 });

    //     const nextId = lastSermon
    //         ? Number(lastSermon.id) + 1
    //         : 1;

    //     const sermon = await Sermon.create({
    //         ...req.body,
    //         id: nextId
    //     });
    // }

    try {

        const thumbnail = req.files?.thumbnail?.[0];
        const video = req.files?.video?.[0];

        if (!thumbnail || !video) {

            return res.status(400).json({
                message: "Both thumbnail and video are required"
            });

        }

        const sermon = await Sermon.create({

            id: Date.now(),

            title: req.body.title,

            speaker: req.body.speaker,

            category: req.body.category,

            description: req.body.description,

            date: req.body.date,

            duration: req.body.duration,

            thumbnail: `uploads/thumbnails/${thumbnail.filename}`,

            videoUrl: `uploads/videos/${video.filename}`

        });

        res.status(201).json(sermon);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create sermon"
        });
    }
};

const updateSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findOneAndUpdate(
            { id: Number(req.params.id) },
            req.body,
            { new: true, runValidators: true }
        );

        if (!sermon) {
            return res.status(404).json({
                message: "Sermon not found"
            });
        }

        res.json(sermon);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update sermon"
        });
    }
};

const deleteSermon = async (req, res) => {
    try {
        const sermon = await Sermon.findOneAndDelete({
            id: Number(req.params.id)
        });

        if (!sermon) {
            return res.status(404).json({
                message: "Sermon not found"
            });
        }

        res.json({
            message: "Sermon deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete sermon"
        });
    }
};

module.exports = {
    getSermons,
    getSermon,
    createSermon,
    updateSermon,
    deleteSermon
};
