
const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    loginAdmin,
    getAdminProfile,
} = require("../controllers/adminAuthController");

const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts. Please try again in 15 minutes.",
    },
});

router.post("/login", loginLimiter, loginAdmin);
router.get("/me", protectAdmin, getAdminProfile);

module.exports = router;
