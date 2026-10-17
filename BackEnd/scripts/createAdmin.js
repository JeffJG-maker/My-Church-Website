
require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDatabase = require("../config/database");
const Admin = require("../models/Admin");

async function createAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        "Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in your .env file."
      );
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error(
        "ADMIN_PASSWORD must contain at least 12 characters."
      );
    }

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error(
        "JWT_SECRET must be set and contain at least 32 characters."
      );
    }

    await connectDatabase();

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(
        "An admin with this email already exists. No changes were made."
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await Admin.create({
      name: ADMIN_NAME.trim(),
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Initial administrator created successfully.");
    console.log(`Admin email: ${email}`);
  } catch (error) {
    console.error("Unable to create admin:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
