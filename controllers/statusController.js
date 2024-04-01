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

    const status = await Status.findAll({});
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
    const { name, type } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: "failure", error: "Name is required" });
    }

    const newStatus = await Status.create({ name, type });

    res.status(201).json({
      status: "success",
      message: "Status created successfully",
      responseData: newStatus,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
  //   [
  //     { name: "Pending", type: "pending" },
  //     { name: "Working", type: "working" },
  //     { name: "Delivered", type: "delivered" },
  //     { name: "On Hold", type: "onhold" },
  //   ];
};

exports.updateStatus = async (req, res) => {
  try {
    const statusId = req.params.id;
    const { name } = req.body;

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
      attributes: ['id', 'name'],
      where: { deletedAt: null },
    });

    const statusData = status.map(({ id, name }) => ({ label: name, value: id }));

    
    res.status(200).json({ status: "success", responseData: statusData });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};
