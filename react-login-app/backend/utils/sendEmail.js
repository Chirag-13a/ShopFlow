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
      const isOtp = subject.toLowerCase().includes("otp");
      const isLogin = subject.toLowerCase().includes("login");
      const headerTitle = isOtp ? `SHOPFLOW OTP` : isLogin ? `SHOPFLOW Login Alert` : `SHOPFLOW Notification`;
      const emoji = isOtp ? "🔐" : isLogin ? "🔔" : "📬";
      // Extract OTP if present in text
      let otpCode = null;
      if (isOtp) {
        const match = text.match(/OTP is: (\d{4,8})/);
        if (match) otpCode = match[1];
      }
      htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>${headerTitle}</title>
        </head>
        <body style="margin:0;padding:0;background:linear-gradient(135deg,#1976d2 0%,#ff9800 100%);font-family:'Segoe UI',Arial,sans-serif;">
          <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.15);padding:0;overflow:hidden;">
            <div style="background:linear-gradient(90deg,#1976d2 60%,#ff9800 100%);padding:28px 0 18px 0;text-align:center;">
              <span style="font-size:2.8rem;">${emoji}</span>
              <h2 style="color:#fff;font-size:2rem;font-weight:900;margin:10px 0 0 0;letter-spacing:1px;">${headerTitle}</h2>
            </div>
            <div style="padding:32px 28px 18px 28px;text-align:center;">
              ${isOtp && otpCode ? `<div style="margin:0 auto 18px auto;display:inline-block;padding:18px 38px;font-size:2.2rem;font-weight:800;letter-spacing:8px;background:#f5f7fa;border-radius:12px;color:#1976d2;border:2px dashed #1976d2;box-shadow:0 2px 8px rgba(25,118,210,0.08);">${otpCode}</div>` : ""}
              <p style="color:#333;font-size:1.13rem;line-height:1.7;margin:0 0 18px 0;">
                ${text.replace(/\n/g, "<br>")}
              </p>
              ${isLogin ? `<div style="margin:18px auto 0 auto;display:inline-block;padding:12px 24px;font-size:1.1rem;font-weight:600;background:#fff3e0;color:#ff9800;border-radius:8px;border:1.5px solid #ff9800;">If this wasn't you, please secure your account.</div>` : ""}
            </div>
            <div style="background:#f5f7fa;padding:18px 0 0 0;text-align:center;border-top:1px solid #eee;">
              <div style="font-size:1rem;color:#1976d2;font-weight:600;">– Team SHOPFLOW</div>
              <div style="font-size:0.97rem;color:#888;margin-top:6px;">Need help? <a href="mailto:support@shopflow.com" style="color:#1976d2;text-decoration:none;">Contact Support</a></div>
              <div style="font-size:0.93rem;color:#bbb;margin:10px 0 0 0;">&copy; ${new Date().getFullYear()} SHOPFLOW. All rights reserved.</div>
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
