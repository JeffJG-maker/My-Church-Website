const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Check required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please provide your name, email and message.",
            });
        }

        // Email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Email sent to the church/admin
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            replyTo: email,
            subject: subject || `New Contact Message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>New Contact Message</h2>

                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject || "No subject"}</p>

                    <h3>Message:</h3>
                    <p>${message}</p>
                </div>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully.",
        });

    } catch (error) {
        console.error("Contact email error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to send your message. Please try again later.",
        });
    }
});

module.exports = router;