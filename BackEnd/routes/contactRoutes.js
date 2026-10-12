
const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Message = require("../models/Message");

const router = express.Router();

const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (character) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[character];
    });

// GET: Retrieve all saved messages
router.get("/", async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve messages.",
        });
    }
});

// POST: Save a contact message and email the church administrator
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide your name, email and message.",
            });
        }

        const savedMessage = await Message.create({
            name: name.trim(),
            email: email.trim(),
            subject:
                typeof subject === "string" && subject.trim()
                    ? subject.trim()
                    : "No subject",
            message: message.trim(),
        });

        // Save succeeds even if the email service is unavailable.
        try {
            if (
                process.env.EMAIL_USER &&
                process.env.EMAIL_PASSWORD &&
                process.env.RECEIVER_EMAIL
            ) {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                });

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: process.env.RECEIVER_EMAIL,
                    replyTo: email.trim(),
                    subject:
                        subject?.trim() ||
                        `New Contact Message from ${name.trim()}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h2>New Contact Message</h2>
                            <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
                            <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
                            <p><strong>Subject:</strong> ${escapeHtml(subject || "No subject")}</p>
                            <h3>Message:</h3>
                            <p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>
                        </div>
                    `,
                });
            }
        } catch (emailError) {
            console.error("Contact email error:", emailError);
        }

        return res.status(201).json({
            success: true,
            message: "Your message has been received successfully.",
            data: savedMessage,
        });
    } catch (error) {
        console.error("Save contact message error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to save your message. Please try again later.",
        });
    }
});

// PATCH: Mark a message as read or unread
router.patch("/:id/read", async (req, res) => {
    try {
        const { read } = req.body;

        if (
            typeof read !== "boolean" ||
            !mongoose.isValidObjectId(req.params.id)
        ) {
            return res.status(400).json({
                success: false,
                message: "A valid message ID and read status are required.",
            });
        }

        const updatedMessage = await Message.findByIdAndUpdate(
            req.params.id,
            { read },
            { new: true, runValidators: true }
        );

        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found.",
            });
        }

        res.json({
            success: true,
            message: "Message status updated.",
            data: updatedMessage,
        });
    } catch (error) {
        console.error("Update message status error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update message status.",
        });
    }
});

// DELETE: Permanently delete a message
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid message ID.",
            });
        }

        const deletedMessage = await Message.findByIdAndDelete(req.params.id);

        if (!deletedMessage) {
            return res.status(404).json({
                success: false,
                message: "Message not found.",
            });
        }

        res.json({
            success: true,
            message: "Message deleted successfully.",
        });
    } catch (error) {
        console.error("Delete message error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete message.",
        });
    }
});

module.exports = router;
