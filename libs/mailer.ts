import nodemailer from "nodemailer";

const {
  mail: { host, port, secure, user, password, from },
  frontend,
} = require("../config");

type PasswordResetEmail = {
  to: string;
  token: string;
};

async function sendPasswordResetEmail({
  to,
  token,
}: PasswordResetEmail): Promise<void> {
  if (!host || !user || !password || !from) {
    throw new Error("SMTP password reset email configuration is incomplete");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass: password },
  });
  const resetUrl = `${frontend.url}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your Ara password",
    text: `Reset your password using this link: ${resetUrl}`,
    html: `<p>Reset your Ara password by clicking the link below.</p><p><a href="${resetUrl}">Reset password</a></p><p>This link expires in one hour.</p>`,
  });
}

module.exports = { sendPasswordResetEmail };
