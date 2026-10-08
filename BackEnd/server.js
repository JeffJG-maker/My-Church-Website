require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const connectDatabase = require("./config/database");

const sermonRoutes = require("./routes/sermonRoutes");
const contactRoutes = require("./routes/contactRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/media", express.static(path.join(__dirname, "media")));
app.use("/churchData", express.static(path.join(__dirname, "churchData")));

app.use("/api/sermons", sermonRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });