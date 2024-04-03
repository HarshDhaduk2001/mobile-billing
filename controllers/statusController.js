const Status = require("../models/statusModel");
const { verifyJWT } = require("../middlewares/authMiddleware");
require("dotenv").config();

exports.getAllStatus = async (req, res) => {
  try {
    const token = req.headers.authorization?.substring(7);
    if (!token) {
      return res
        .status(401)
        .json({ status: "failure", error: "Unauthorized: Token missing" });
    }

    const verify = await verifyJWT(token);
    if (!verify) {
      return res
        .status(403)
        .json({ status: "failure", error: "Invalid token" });
    }

    const status = await Status.findAll({
      attributes: ["id", "name", "type", "colorCode"],
    });
    res.status(200).json({ status: "success", responseData: status });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.getStatusById = async (req, res) => {
  try {
    const statusId = req.params.id;
    if (isNaN(statusId) || statusId <= 0) {
      return res
        .status(400)
        .json({ status: "failure", error: "Invalid status ID" });
    }

    const status = await Status.findOne({
      where: { id: statusId, deletedAt: null },
    });

    if (!status) {
      return res
        .status(404)
        .json({ status: "failure", error: "Status not found" });
    }

    res.status(200).json({ status: "success", responseData: status });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.createStatus = async (req, res) => {
  try {
    const { name, type, colorCode } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: "failure", error: "Name is required" });
    }

    const newStatus = await Status.create({ name, type, colorCode });

    res.status(201).json({
      status: "success",
      message: "Status created successfully",
      responseData: newStatus,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
  // Add this statuses
  // { "name": "Pending", "type": "pending", "colorCode": "#A5A5A5"
  // }
  // { "name": "Working", "type": "working", "colorCode": "#4472C4"
  // }
  // { "name": "Ready For Delivery", "type": "readyForDelivered", "colorCode": "#008EFF"
  // }
  // { "name": "Received By Client", "type": "receivedByClient", "colorCode": "#3CB371"
  // }
  // { "name": "On Hold", "type": "onhold", "colorCode": "#FFC000"
  // }
};

exports.updateStatus = async (req, res) => {
  try {
    const statusId = req.params.id;
    const { name, colorCode } = req.body;

    if (!name || !statusId) {
      return res
        .status(400)
        .json({ status: "failure", error: "Name and ID are required" });
    }

    const status = await Status.findOne({
      where: { id: statusId, deletedAt: null },
    });
    if (!status) {
      return res
        .status(404)
        .json({ status: "failure", error: "Status not found" });
    }

    status.name = name;
    status.colorCode = colorCode;
    await status.save();

    res
      .status(200)
      .json({ status: "success", message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.deleteStatus = async (req, res) => {
  try {
    const statusId = req.params.id;

    if (!statusId) {
      return res
        .status(400)
        .json({ status: "failure", error: "Invalid status ID" });
    }

    const status = await Status.findOne({
      where: { id: statusId, deletedAt: null },
    });
    if (!status) {
      return res
        .status(404)
        .json({ status: "failure", error: "Status not found" });
    }

    status.deletedAt = new Date();
    await status.save();

    res
      .status(200)
      .json({ status: "success", message: "Status deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.getStatusList = async (req, res) => {
  try {
    const token = req.headers.authorization?.substring(7);
    if (!token) {
      return res
        .status(401)
        .json({ status: "failure", error: "Unauthorized: Token missing" });
    }

    const verify = await verifyJWT(token);
    if (!verify) {
      return res
        .status(403)
        .json({ status: "failure", error: "Invalid token" });
    }

    const status = await Status.findAll({
      attributes: ["id", "name", "colorCode"],
      where: { deletedAt: null },
    });

    const statusData = status.map(({ id, name }) => ({
      label: name,
      value: id,
      colorCode: colorCode,
    }));

    res.status(200).json({ status: "success", responseData: statusData });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};
