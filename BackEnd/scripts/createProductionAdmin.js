
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function main() {
    const { MONGO_URI, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } =
        process.env;

    if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("Required production environment variables are missing.");
    }

    if (!JWT_SECRET || JWT_SECRET.length < 32) {
        throw new Error("JWT_SECRET is missing or too short.");
    }

    if (ADMIN_PASSWORD.length < 12) {
        throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
    }

    await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
    });

    console.log("Connected to the configured production database.");

    const email = ADMIN_EMAIL.trim().toLowerCase();
    const existing = await Admin.findOne({ email });

    if (existing) {
        console.log("An admin with this email already exists. No changes made.");
        return;
    }

    await Admin.create({
        name: ADMIN_NAME.trim(),
        email,
        password: await bcrypt.hash(ADMIN_PASSWORD, 12),
        role: "admin",
        isActive: true,
    });

    console.log("Production administrator created successfully.");
}

main()
    .catch((error) => {
        console.error("Admin setup failed:", error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect().catch(() => { });
    });
