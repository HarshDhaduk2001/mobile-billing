const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendPasswordResetEmail } = require("../utils/nodemailer");
const { ResponseData } = require("../utils/responseData");
const sequelize = require("../config/db");

const secretKey = process.env.SECRET_KEY;

exports.register = async (req, res) => {
  const { name, orgId, email, password, contactNo, shopName, shopAddress } =
    req.body;

  try {
    const existingUser = await User.findOne({ where: { email, orgId } });
    if (existingUser) {
      return ResponseData(
        res,
        200,
        "warning",
        null,
        "User with this email and organization already exists."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      orgId,
      email,
      password: hashedPassword,
      contactNo,
      shopName,
      shopAddress,
    });

    return ResponseData(
      res,
      200,
      "success",
      null,
      "User registered successfully."
    );
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return ResponseData(res, 200, "warning", null, "User does not exist.");
    }

    if (user.deletedAt !== null) {
      return ResponseData(res, 200, "warning", null, "User is deactivated.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return ResponseData(res, 200, "warning", null, "Invalid credentials.");
    }

    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        orgId: user.orgId,
        userType: user.userType,
      },
      secretKey,
      {
        expiresIn: "1d",
      }
    );
    return ResponseData(
      res,
      200,
      "success",
      token,
      "You have been Logged in successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email, deletedAt: null } });
    if (!user) {
      return ResponseData(res, 200, "failure", null, "User does not exist.");
    }

    const token = jwt.sign({ id: user.userId }, secretKey, { expiresIn: "1m" });

    await sendPasswordResetEmail(user, token, res);
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
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
      return ResponseData(res, 200, "failure", null, "User not found.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Password reset successfully."
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ResponseData(res, 200, "failure", null, "Token has been expired.");
    } else {
      return ResponseData(res, 500, "failure", null, "Internal Server Error.");
    }
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const pageSize = parseInt(req.body.pageSize) || 10;
    const pageNumber = parseInt(req.body.pageNumber) || 1;
    const globalSearch = req.body.globalSearch || null;
    const orgId = req.user.orgId;
    const userType = req.user.userType;

    const userDetails = await User.sequelize.query(
      "CALL GetAllUsers(:pageSize, :pageNumber, :globalSearch, :orgId, :userType)",
      {
        replacements: {
          pageSize,
          pageNumber,
          globalSearch,
          orgId,
          userType,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return res.status(200).json({
      ResponseStatus: "success",
      ResponseData: {
        List: Object.values(userDetails[1]),
        TotalCount: userDetails[0][0].totalCount,
      },
      Message: null,
    });
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateUser = async (req, res) => {
  const { id, orgId, name, email, password, contactNo, shopName, shopAddress } =
    req.body;

  try {
    const existingUser = await User.findByPk(id);
    if (!existingUser) {
      return ResponseData(res, 200, "failure", null, "User not found.");
    }

    existingUser.name = name;
    existingUser.orgId = orgId;
    existingUser.email = email;
    existingUser.contactNo = contactNo;
    existingUser.shopName = shopName;
    existingUser.shopAddress = shopAddress;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      "User updated successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return ResponseData(res, 200, "failure", null, "Invalid user ID.");
    }

    const user = await User.findOne({
      where: { userId: userId, deletedAt: null },
    });
    if (!user) {
      return ResponseData(res, 200, "failure", null, "User not found.");
    }

    user.deletedAt = new Date();
    await user.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      "User deleted successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
