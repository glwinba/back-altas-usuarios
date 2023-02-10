import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: "smtp.googlemail.com",
  port: 465,
  service: 'gmail',
  secure: true,
  auth: {
    user: 'crodriguez@glwinba.com',
    pass: 'aabatuxdrgvocndu'
  }
});


export default transporter