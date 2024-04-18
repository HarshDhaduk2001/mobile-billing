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
  const resetLink = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: user.email,
    subject: "Password Reset Request",
    html: `<table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f5f5f5"
  >
    <tr>
      <td align="center" valign="top" style="padding: 40px 15px">
        <table
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            background-color: #ffffff;
            max-width: 600px;
            width: 100%;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          "
        >
          <tr>
            <td align="center" valign="top" style="padding: 40px 20px">
              <h1
                style="font-size: 24px; color: #333333; margin-bottom: 20px"
              >
                Password Reset
              </h1>
              <p>Hello ${user.name},</p>
              <p>
                You requested a password reset. Click the button below to
                reset your password:
              </p>
              <table
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="margin-top: 30px"
              >
                <tr>
                  <td
                    align="center"
                    bgcolor="#007bff"
                    style="border-radius: 5px"
                  >
                    <a
                      href="${resetLink}"
                      target="_blank"
                      style="
                        font-size: 16px;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 15px 30px;
                        border-radius: 5px;
                        display: inline-block;
                        background-color: #007bff;
                      "
                      >Reset Password</a
                    >
                  </td>
                </tr>
              </table>
              <p style="margin-top: 30px">
                If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    ResponseData(res, 200, "success", null, "Please check your email.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
