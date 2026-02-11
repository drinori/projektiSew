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
      html: `
        <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:500px;margin:auto;background:#ffffff;border-radius:10px;padding:32px;text-align:center;">
            
            <h2 style="color:#111827;margin-bottom:10px;">
                ${subjekti}
            </h2>

            <p style="color:#4b5563;font-size:15px;margin-bottom:30px;">
                ${mesazhi}
            </p>

            <div style="
              display:inline-block;
              background:#111827;
              color:#ffffff;
              font-size:32px;
              letter-spacing:6px;
              padding:16px 28px;
              border-radius:8px;
              font-weight:bold;
              margin-bottom:30px;
            ">
              ${mesazhi}
            </div>

            <p style="font-size:13px;color:#6b7280;">
              Ky kod skadon pas 5 minutash.
            </p>

            <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;" />

            <p style="font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} Punesohu
            </p>
          </div>
        </div>
      `,
    });
  }
};

module.exports = dergoMesazhin;
