"use strict";

const nodemailer = require("nodemailer");

const emailConfig = {
  service: process.env.EMAIL_SERVICE || "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer configuration error: " + error);
  } else {
    console.log("Nodemailer server is ready to send message");
  }
});

module.exports = transporter;
