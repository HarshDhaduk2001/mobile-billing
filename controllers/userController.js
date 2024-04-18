const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ExcelJS = require("exceljs");
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

    const token = jwt.sign({ id: user.userId }, secretKey, { expiresIn: "1d" });

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
      where: { userId: decoded.id, deletedAt: null },
    });

    if (!user) {
      return ResponseData(res, 200, "failure", null, "User not found.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(
      { password: hashedPassword },
      {
        where: { userId: decoded.id },
      }
    );

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
    const isDownload = true;

    const userDetails = await User.sequelize.query(
      "CALL GetAllUsers(:pageSize, :pageNumber, :globalSearch, :orgId, :userType, :isDownload)",
      {
        replacements: {
          pageSize,
          pageNumber,
          globalSearch,
          orgId,
          userType,
          isDownload,
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
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getUserDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return ResponseData(res, 200, "failure", null, "User not found.");
    }

    const responseData = {
      userId: existingUser.userId,
      orgId: existingUser.orgId,
      userType: existingUser.userType,
      userName: existingUser.name,
    };

    return ResponseData(res, 200, "success", responseData, null);
  } catch (error) {
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

exports.toggleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return ResponseData(res, 200, "failure", null, "Invalid user ID.");
    }

    const user = await User.findOne({
      where: { userId: userId },
    });
    if (!user) {
      return ResponseData(res, 200, "failure", null, "User not found.");
    }

    if (user.deletedAt === null) {
      user.deletedAt = new Date();
    } else {
      user.deletedAt = null;
    }
    await user.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      `User ${
        user.deletedAt === null ? "activated" : "deactivated"
      } successfully.`
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.exportUsersToExcel = async (req, res) => {
  try {
    const pageSize = parseInt(req.body.pageSize) || 10;
    const pageNumber = parseInt(req.body.pageNumber) || 1;
    const globalSearch = req.body.globalSearch || null;
    const orgId = req.user.orgId;
    const userType = req.user.userType;
    const isDownload = true;

    const resData = await User.sequelize.query(
      "CALL GetAllUsers(:pageSize, :pageNumber, :globalSearch, :orgId, :userType, :isDownload)",
      {
        replacements: {
          pageSize,
          pageNumber,
          globalSearch,
          orgId,
          userType,
          isDownload,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const userDetails = Object.values(resData[1]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Contact No", key: "contactNo" },
      { header: "Shop Name", key: "shopName" },
      { header: "Shop Address", key: "shopAddress" },
      { header: "Organization Name", key: "organizationName" },
      { header: "Is Active", key: "deletedAt" },
    ];

    userDetails.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        name: user.name,
        email: user.email,
        contactNo: user.contactNo,
        shopName: user.shopName,
        shopAddress: user.shopAddress,
        organizationName: user.organizationName,
        deletedAt: user.deletedAt === null ? true : false,
      });
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        maxLength = Math.max(maxLength, columnLength);
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
      column.alignment = { horizontal: "left" };
    });

    const filename = "users.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return res.status(200).sendFile(filename, { root: "./" });
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

// organizationRoute.js
const express = require("express");
const organizationController = require("../controllers/organizationController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, organizationController.getAllOrganizations);
router.get(
  "/organizationlist",
  authenticateJWT,
  organizationController.getOrganizationList
);
router.get("/:id", authenticateJWT, organizationController.getOrganizationById);
router.post("/", organizationController.createOrganization);
router.post(
  "/toggle/:id",
  authenticateJWT,
  organizationController.toggleOrganization
);
router.post("/:id", authenticateJWT, organizationController.updateOrganization);

module.exports = router;
