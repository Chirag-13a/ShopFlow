const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
  console.log("Attempting to send email to:", to);
  console.log("Subject:", subject);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP transporter verified");

    // If HTML not provided, use a default template
    let htmlContent = html;
    if (!htmlContent) {
      const headerTitle = subject.includes("OTP")
        ? "Verify Your Email"
        : subject.includes("Login")
        ? "Login Alert"
        : "Message from E-commerce";

      const emoji = subject.includes("OTP")
        ? "🔐"
        : subject.includes("Login")
        ? "🔔"
        : "📬";

      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>${headerTitle}</title>
        </head>
        <body style="margin:0;padding:0;background:linear-gradient(135deg,#1976d2 0%,#ff9800 100%);font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.15);padding:32px;">
            <div style="text-align:center;margin-bottom:16px;font-size:3rem;">${emoji}</div>
            <h2 style="color:#1976d2;text-align:center;font-size:1.8rem;font-weight:800;margin-bottom:18px;">${headerTitle}</h2>
            <p style="color:#333;font-size:1.1rem;line-height:1.6;text-align:center;">
              ${text.replace(/\n/g, "<br>")}
            </p>
            <div style="text-align:center;margin-top:24px;font-size:1rem;color:#1976d2;font-weight:600;">
              – Team E-commerce
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const info = await transporter.sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text,
      html: htmlContent,
    });

    console.log("Email successfully sent to:", to);
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("Failed to send email:", error.message);
    if (error.response) {
      console.error("SMTP Error Response:", error.response);
    }
  }
};

module.exports = sendEmail;
