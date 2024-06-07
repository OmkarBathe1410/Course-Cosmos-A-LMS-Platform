"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
require("dotenv").config();
// Function to send an email using nodemailer
const sendEmail = async (options) => {
    // Create a nodemailer transporter with SMTP configuration
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    // Destructure email options
    const { email, subject, template, data } = options;
    // Construct the path to the email template
    const templatePath = path_1.default.join(__dirname, "../mails", template);
    // Render the email template using EJS
    const html = await ejs_1.default.renderFile(templatePath, data);
    // Define mail options for nodemailer
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    };
    // Send the email using the transporter
    await transporter.sendMail(mailOptions);
};
exports.default = sendEmail;
