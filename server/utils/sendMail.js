const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const sendEmail = asyncHandler(async (to, subject, code, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SENDMAIL_USER,
      pass: process.env.SENDMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "facebookServies@gmail.com",
    to,
    subject,
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <h2 style="color: #1a0dab;">Account Authentication</h2>
      <p style="font-size: 14px;">Dear ${to},</p>
      <p style="font-size: 14px;">Please click the link below to authenticate your account:</p>
      <a href=${link} style="background-color: #4285f4; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Authenticate Account</a>
      <p style="font-size: 14px;">If you did not request this authentication, please ignore this email.</p>
      <p style="font-size: 14px;">Best regards,<br>Facebook Services</p>
      
      <div style="background-color: #f5f5f5; padding: 10px; margin-top: 20px;">
        <pre style="font-family: monospace; white-space: pre-wrap; overflow-x: auto;">your code: ${code}</pre>
      </div>
    </div>
  `,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
});

module.exports = sendEmail;
