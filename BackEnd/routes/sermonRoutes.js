const express = require("express");

const router = express.Router();

const upload = require("../config/upload");

const {
    getSermons,
    getSermon,
    createSermon,
    updateSermon,
    deleteSermon, 
    getLatestSermons
} = require("../controllers/sermonController");

router.get("/", getSermons);
router.get("/latest", getLatestSermons);
router.get("/:id", getSermon);
router.post(
    "/",
    upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "video", maxCount: 1 }
    ]),
    createSermon
);
router.put("/:id", updateSermon);
router.delete("/:id", deleteSermon);

module.exports = router;