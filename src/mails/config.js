import nodemailer from "nodemailer";
import config from "../config.js";

let transporter = nodemailer.createTransport({
  host: config.MAIL_HOST,
  port: config.MAIL_PORT,
  service: config.MAIL_SERVICE,
  secure: true,
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS
  }
});


export default transporter