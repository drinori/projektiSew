const nodemailer = require("nodemailer");
require("dotenv").config();

const transportuesi = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const dergoMesazhin = async (emailPerdoruesit, subjekti, mesazhi) => {
  const emails = Array.isArray(emailPerdoruesit)
    ? emailPerdoruesit
    : [emailPerdoruesit];
  for (const email of emails) {
    await transportuesi.sendMail({
      from: `"Punesohu" <punesohu.info@gmail.com>`,
      to: email,
      subject: subjekti,
      html: `<h1>${mesazhi}</h1>`,
    });
  }
};

module.exports = dergoMesazhin;
