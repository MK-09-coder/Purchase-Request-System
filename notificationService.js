
/**
 * @file notificationService.js
 * @description This module provides a service for sending emails using Nodemailer.
 */

const nodemailer = require('nodemailer');

/**
 * Creates a Nodemailer transporter using Gmail service and authentication details from environment variables. (Notification MicroService)
 * @constant {Object} transporter
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,  // Gmail address
    pass: process.env.GMAIL_PASS   // App-specific password
  }
});

/**
 * Sends an email using the Nodemailer transporter.
 * 
 * @function sendEmail
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The text content of the email.
 * @returns {void}
 */
function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

module.exports = { sendEmail };
