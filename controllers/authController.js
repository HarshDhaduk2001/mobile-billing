// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendPasswordResetEmail } = require("../utils/nodemailer");

const secretKey = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(200)
        .json({ status: "success", message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res
      .status(200)
      .json({ status: "success", message: "User registered successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ status: "failure", error: "User does not exist." });
    }

    if (user.deletedAt !== null) {
      return res
        .status(401)
        .json({ status: "failure", error: "User is deactivated." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(402)
        .json({ status: "failure", error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({
        status: "success",
        message: "Login successful",
        responseData: token,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email, deletedAt: null } });
    if (!user) {
      return res
        .status(401)
        .json({ status: "failure", error: "User does not exist." });
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1m" });

    await sendPasswordResetEmail(user, token, res);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Find the user by token
    const user = await User.findOne({
      where: { id: decoded.id, deletedAt: null },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(500).json({ message: "Token is expired" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "failure", error: "Invalid user ID" });
    }

    const user = await User.findOne({
      where: { id: userId, deletedAt: null },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "failure", error: "User not found" });
    }

    user.deletedAt = new Date();
    await user.save();

    res
      .status(200)
      .json({ status: "success", message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};
