const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const VALID_ROLES = ["admin", "editor", "viewer"];

// Return safe user information without exposing passwords.
const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});

// GET ALL USERS
const listUsers = async (req, res, next) => {
    try {
        const users = await Admin.find({})
            .select("name email role isActive createdAt updatedAt")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users: users.map(publicUser),
        });
    } catch (error) {
        next(error);
    }
};

// CREATE USER
const createUser = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role = "viewer",
            isActive = true,
        } = req.body;

        const normalizedEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        const normalizedName =
            typeof name === "string" ? name.trim() : "";

        const normalizedRole = String(role).toLowerCase();

        if (
            !normalizedName ||
            !normalizedEmail ||
            !/^\S+@\S+\.\S+$/.test(normalizedEmail)
        ) {
            return res.status(400).json({
                success: false,
                message: "Provide a valid name and email address.",
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "The initial password must contain at least 8 characters.",
            });
        }

        if (!VALID_ROLES.includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: "Choose a valid account role.",
            });
        }

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "Account status must be active or inactive.",
            });
        }

        const existing = await Admin.findOne({
            email: normalizedEmail,
        }).select("_id");

        if (existing) {
            return res.status(409).json({
                success: false,
                message: "A user with this email address already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await Admin.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
            role: normalizedRole,
            isActive,
        });

        res.status(201).json({
            success: true,
            message: "User account created successfully.",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A user with this email address already exists.",
            });
        }

        next(error);
    }
};

// UPDATE USER
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        const user = await Admin.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found.",
            });
        }

        const originalRole = user.role;
        const originalIsActive = user.isActive;

        const { name, email, role, isActive, password } = req.body;

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty.",
                });
            }

            user.name = name.trim();
        }

        if (email !== undefined) {
            const normalizedEmail =
                typeof email === "string" ? email.trim().toLowerCase() : "";

            if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: "Provide a valid email address.",
                });
            }

            const duplicate = await Admin.findOne({
                email: normalizedEmail,
                _id: { $ne: id },
            }).select("_id");

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message: "A user with this email address already exists.",
                });
            }

            user.email = normalizedEmail;
        }

        if (role !== undefined) {
            const normalizedRole = String(role).toLowerCase();

            if (!VALID_ROLES.includes(normalizedRole)) {
                return res.status(400).json({
                    success: false,
                    message: "Choose a valid account role.",
                });
            }

            user.role = normalizedRole;
        }

        if (isActive !== undefined) {
            if (typeof isActive !== "boolean") {
                return res.status(400).json({
                    success: false,
                    message: "Account status must be active or inactive.",
                });
            }

            user.isActive = isActive;
        }

        if (password !== undefined && password !== "") {
            if (typeof password !== "string" || password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "A new password must contain at least 8 characters.",
                });
            }

            user.password = await bcrypt.hash(password, 12);
        }

        // Protect the last active administrator.
        if (
            originalRole === "admin" &&
            originalIsActive &&
            (user.role !== "admin" || !user.isActive)
        ) {
            const activeAdmins = await Admin.countDocuments({
                role: "admin",
                isActive: true,
            });

            if (activeAdmins <= 1) {
                return res.status(400).json({
                    success: false,
                    message:
                        "You cannot demote or deactivate the last active administrator.",
                });
            }
        }

        await user.save();

        res.json({
            success: true,
            message: "User account updated successfully.",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A user with this email address already exists.",
            });
        }

        next(error);
    }
};

// DELETE USER
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        // Prevent an administrator from deleting their own account.
        if (String(req.admin._id) === String(id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete the account you are currently using.",
            });
        }

        const user = await Admin.findById(id).select(
            "name role isActive"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found.",
            });
        }

        // Protect the last active administrator.
        if (user.role === "admin" && user.isActive) {
            const activeAdmins = await Admin.countDocuments({
                role: "admin",
                isActive: true,
            });

            if (activeAdmins <= 1) {
                return res.status(400).json({
                    success: false,
                    message:
                        "You cannot delete the last active administrator.",
                });
            }
        }

        await Admin.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "User account deleted successfully.",
            id,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listUsers,
    createUser,
    updateUser,
    deleteUser,
};