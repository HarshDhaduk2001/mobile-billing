const Status = require("../models/statusModel");
require("dotenv").config();

exports.getAllStatus = async (req, res) => {
  try {
    const status = await Status.findAll({
      attributes: ["id", "name", "type", "colorCode"],
    });

    ResponseData(res, 200, "success", status, null);
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getStatusById = async (req, res) => {
  try {
    const statusId = req.params.id;
    if (isNaN(statusId) || statusId <= 0) {
      ResponseData(res, 200, "failure", null, "Invalid status ID.");
    }

    const status = await Status.findOne({
      where: { id: statusId, deletedAt: null },
    });

    if (!status) {
      ResponseData(res, 200, "failure", null, "Status not found.");
    }

    ResponseData(res, 200, "success", status, null);
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.createStatus = async (req, res) => {
  try {
    const { name, type, colorCode } = req.body;

    if (!name) {
      ResponseData(res, 200, "failure", null, "Name is required.");
    }

    const newStatus = await Status.create({ name, type, colorCode });

    ResponseData(
      res,
      200,
      "success",
      newStatus,
      "Status created successfully."
    );
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
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
      ResponseData(res, 200, "failure", null, "Name and ID are required.");
    }

    const status = await Status.findOne({
      where: { id: statusId, deletedAt: null },
    });
    if (!status) {
      ResponseData(res, 200, "failure", null, "Status not found.");
    }

    status.name = name;
    status.colorCode = colorCode;
    await status.save();

    ResponseData(res, 200, "success", null, "Status updated successfully.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.deleteStatus = async (req, res) => {
  try {
    const statusId = req.params.id;

    if (!statusId) {
      ResponseData(res, 200, "failure", null, "Invalid status ID.");
    }

    const status = await Status.findOne({
      where: { id: statusId, deletedAt: null },
    });
    if (!status) {
      ResponseData(res, 200, "failure", null, "Status not found.");
    }

    status.deletedAt = new Date();
    await status.save();

    ResponseData(
      res,
      200,
      "success",
      null,
      "Status has been deleted successfully."
    );
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getStatusList = async (req, res) => {
  try {
    const status = await Status.findAll({
      attributes: ["id", "name", "colorCode"],
      where: { deletedAt: null },
    });

    const statusData = status.map(({ id, name, colorCode }) => ({
      label: name,
      value: id,
      colorCode: colorCode,
    }));

    ResponseData(res, 200, "success", statusData, null);
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
