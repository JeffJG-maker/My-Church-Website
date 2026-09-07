const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "thumbnail") {
            cb(null, path.join(__dirname, "../uploads/thumbnails"));
        }

        else if (file.fieldname === "video") {
            cb(null, path.join(__dirname, "../uploads/videos"));
        }

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }

});

const upload = multer({
    storage
});

module.exports = upload;