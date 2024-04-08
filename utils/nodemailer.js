const nodemailer = require("nodemailer");
const { ResponseData } = require("./responseData");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendPasswordResetEmail = async (user, token, res) => {
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Hello ${user.name},</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    ResponseData(res, 200, "success", null, "Email sent successfully.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
