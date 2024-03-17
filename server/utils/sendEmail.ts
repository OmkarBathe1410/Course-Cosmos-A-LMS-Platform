import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
require("dotenv").config();

// Define the structure of email options
interface IEmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

// Function to send an email using nodemailer
const sendEmail = async (options: IEmailOptions): Promise<void> => {
  // Create a nodemailer transporter with SMTP configuration
  const transporter: Transporter = nodemailer.createTransport({
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
  const templatePath = path.join(__dirname, "../mails", template);

  // Render the email template using EJS
  const html: string = await ejs.renderFile(templatePath, data);

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

export default sendEmail;
