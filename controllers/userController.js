const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendPasswordResetEmail } = require("../utils/nodemailer");
const { ResponseData } = require("../utils/responseData");

const secretKey = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const { name, email, password, contactNo, shopName, shopAddress } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      ResponseData(res, 200, "warning", null, "User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      contactNo,
      shopName,
      shopAddress,
    });

    ResponseData(res, 200, "success", null, "User registered successfully.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      ResponseData(res, 200, "warning", null, "User does not exist.");
    }

    if (user.deletedAt !== null) {
      ResponseData(res, 200, "warning", null, "User is deactivated.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      ResponseData(res, 200, "warning", null, "Invalid credentials.");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "1d",
    });
    ResponseData(
      res,
      200,
      "success",
      token,
      "You have been Logged in successfully."
    );
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email, deletedAt: null } });
    if (!user) {
      ResponseData(res, 200, "failure", null, "User does not exist.");
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1m" });

    await sendPasswordResetEmail(user, token, res);
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({
      where: { id: decoded.id, deletedAt: null },
    });

    if (!user) {
      ResponseData(res, 200, "failure", null, "User not found.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    ResponseData(res, 200, "success", null, "Password reset successfully.");
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      ResponseData(res, 200, "failure", null, "Token has been expired.");
    } else {
      ResponseData(res, 500, "failure", null, "Internal Server Error.");
    }
  }
};

exports.updateUser = async (req, res) => {
  const { id, name, email, password, contactNo, shopName, shopAddress } =
    req.body;

  try {
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      ResponseData(res, 200, "failure", null, "User not found.");
    }

    existingUser.name = name;
    existingUser.email = email;
    existingUser.contactNo = contactNo;
    existingUser.shopName = shopName;
    existingUser.shopAddress = shopAddress;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();

    ResponseData(res, 200, "success", null, "User updated successfully.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      ResponseData(res, 200, "failure", null, "Invalid user ID.");
    }

    const user = await User.findOne({
      where: { id: userId, deletedAt: null },
    });
    if (!user) {
      ResponseData(res, 200, "failure", null, "User not found.");
    }

    user.deletedAt = new Date();
    await user.save();

    ResponseData(res, 200, "success", null, "User deleted successfully.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
