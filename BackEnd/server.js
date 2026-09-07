require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const connectDatabase = require("./config/database");
const sermonRoutes = require("./routes/sermonRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/sermons", sermonRoutes);

const PORT = 5000;
// app.get("/api/sermons/:id", ...);

connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

