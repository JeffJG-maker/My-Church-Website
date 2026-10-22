
require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const connectDatabase = require("./config/database");

const sermonRoutes = require("./routes/sermonRoutes");
const contactRoutes = require("./routes/contactRoutes");
const eventRoutes = require("./routes/eventRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");

const protectAdmin = require("./middleware/adminAuth");

const app = express();

// app.use(
//   cors({
//     origin: process.env.ADMIN_FRONTEND_URL || "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );



const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://lfc-iguosa-admin-dashboard.onrender.com",
  "https://lfcwinnersiguosa.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin not allowed by CORS: ${origin}`)
      );
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json({ limit: "1mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/media", express.static(path.join(__dirname, "media")));
app.use("/churchData", express.static(path.join(__dirname, "churchData")));

// Admin authentication endpoints
app.use("/api/admin-auth", adminAuthRoutes);

// Protect sermon creation, editing and deletion.
// Public sermon viewing and downloads remain available.
app.use(
  "/api/sermons",
  (req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return protectAdmin(req, res, next);
    }

    next();
  },
  sermonRoutes
);

// Protect event creation, editing and deletion.
// Public event viewing remains available.
app.use(
  "/api/events",
  (req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return protectAdmin(req, res, next);
    }

    next();
  },
  eventRoutes
);

// Contact submission remains public.
// Reading, marking as read, and deleting messages require admin login.
app.use(
  "/api/contact",
  (req, res, next) => {
    if (req.method !== "POST") {
      return protectAdmin(req, res, next);
    }

    next();
  },
  contactRoutes
);

// Keep existing media routes available.
// We will secure media-management operations separately once we
// confirm the current mediaRoutes.js implementation.
app.use("/api/media", mediaRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Church backend is running.",
  });
});

// Central error handler
app.use((error, req, res, next) => {
  console.error("API error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected server error occurred."
        : error.message || "An unexpected server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
