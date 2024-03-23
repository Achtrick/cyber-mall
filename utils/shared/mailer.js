import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_SUPERADMIN_EMAIL,
    pass: process.env.AUTH_SUPERADMIN_PASS,
  },
});

export const mailcss = {
  background: `
      style="background: black;
      border-radius: 5px;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      color: white !important;"`,
  body: `
      style="background: #3d3d3d;
      border-radius: 5px;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      padding-bottom: 5px;
      "`,
};
