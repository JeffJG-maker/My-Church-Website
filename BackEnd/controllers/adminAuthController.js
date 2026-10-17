
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide your email and password.",
            });
        }

        const admin = await Admin.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            { adminId: admin._id.toString(), role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful.",
            token,
            expiresIn: 28800,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getAdminProfile = async (req, res) => {
    return res.status(200).json({
        success: true,
        admin: {
            id: req.admin._id,
            name: req.admin.name,
            email: req.admin.email,
            role: req.admin.role,
        },
    });
};

module.exports = {
    loginAdmin,
    getAdminProfile,
};
