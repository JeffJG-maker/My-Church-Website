const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

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
const adminUserRoutes = require("./routes/adminUserRoutes");

const protectAdmin = require("./middleware/adminAuth");
const authorizeRoles = require("./middleware/authorizeRoles");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:7000",
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

// Authentication and administrator management endpoints
app.use("/api/admin-auth", adminAuthRoutes);
app.use("/api/admin-users", adminUserRoutes);

// Protect sermon creation, editing and deletion.
// Public sermon viewing and downloads remain available.
app.use(
  "/api/sermons",
  (req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return protectAdmin(req, res, (error) => {
        if (error) return next(error);
        return authorizeRoles("admin", "editor")(req, res, next);
      });
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
      return protectAdmin(req, res, (error) => {
        if (error) return next(error);
        return authorizeRoles("admin", "editor")(req, res, next);
      });
    }

    next();
  },
  eventRoutes
);

// Contact submission remains public.
// Reading, marking as read, and deleting messages require Admin access.
app.use(
  "/api/contact",
  (req, res, next) => {
    if (req.method !== "POST") {
      return protectAdmin(req, res, (error) => {
        if (error) return next(error);
        return authorizeRoles("admin")(req, res, next);
      });
    }

    next();
  },
  contactRoutes
);

// Media Library reads remain available to existing dashboard flows.
// Creating, updating and deleting media requires Admin or Editor access.
app.use(
  "/api/media",
  (req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      return protectAdmin(req, res, (error) => {
        if (error) return next(error);
        return authorizeRoles("admin", "editor")(req, res, next);
      });
    }

    next();
  },
  mediaRoutes
);

// Backend health check
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