const Status = require("../models/statusModel");
const { ResponseData } = require("../utils/responseData");
require("dotenv").config();

exports.getAllStatus = async (req, res) => {
  try {
    const status = await Status.findAll({
      attributes: ["statusId", "name", "type", "colorCode", "deletedAt"],
    });

    return ResponseData(res, 200, "success", status, null);
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getStatusById = async (req, res) => {
  try {
    const statusId = req.params.id;
    if (isNaN(statusId) || statusId <= 0) {
      return ResponseData(res, 200, "failure", null, "Invalid status ID.");
    }

    const status = await Status.findOne({
      where: { statusId, deletedAt: null },
    });

    if (!status) {
      return ResponseData(res, 200, "failure", null, "Status not found.");
    }

    return ResponseData(
      res,
      200,
      "success",
      {
        id: status.statusId,
        name: status.name,
        type: status.type,
        colorCode: status.colorCode,
      },
      null
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.createStatus = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const createdStatuses = [];
      const existingStatusTypes = new Set();

      const existingStatusRecords = await Status.findAll({
        attributes: ["type"],
      });
      existingStatusRecords.forEach((status) =>
        existingStatusTypes.add(status.type)
      );

      for (const statusObj of req.body) {
        const { name, type, colorCode } = statusObj;
        if (!name) {
          return ResponseData(
            res,
            200,
            "failure",
            null,
            "Name is required for all statuses."
          );
        }

        if (existingStatusTypes.has(type)) {
          continue;
        }

        const newStatus = await Status.create({ name, type, colorCode });
        createdStatuses.push(newStatus);
        existingStatusTypes.add(type);
      }

      return ResponseData(
        res,
        200,
        "success",
        null,
        createdStatuses.length <= 0
          ? "Statuses already exists."
          : "Statuses created successfully."
      );
    } else {
      const { name, type, colorCode } = req.body;
      if (!name) {
        return ResponseData(res, 200, "failure", null, "Name is required.");
      }

      const existingStatus = await Status.findOne({ where: { type } });
      if (existingStatus) {
        return ResponseData(
          res,
          200,
          "failure",
          null,
          `Status with type '${type}' already exists.`
        );
      }

      await Status.create({ name, type, colorCode });

      return ResponseData(
        res,
        200,
        "success",
        null,
        "Status created successfully."
      );
    }
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const statusId = req.params.id;
    const { name, colorCode } = req.body;

    if (!name || !statusId) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        "Name and ID are required."
      );
    }

    const status = await Status.findOne({
      where: { statusId, deletedAt: null },
    });
    if (!status) {
      return ResponseData(res, 200, "failure", null, "Status not found.");
    }

    status.name = name;
    status.colorCode = colorCode;
    await status.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Status updated successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.deleteStatus = async (req, res) => {
  try {
    const statusId = req.params.id;

    if (!statusId) {
      return ResponseData(res, 200, "failure", null, "Invalid status ID.");
    }

    const status = await Status.findOne({
      where: { statusId, deletedAt: null },
    });
    if (!status) {
      return ResponseData(res, 200, "failure", null, "Status not found.");
    }

    status.deletedAt = new Date();
    await status.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Status has been deleted successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getStatusList = async (req, res) => {
  try {
    const status = await Status.findAll({
      attributes: ["statusId", "name", "colorCode"],
      where: { deletedAt: null },
    });

    const statusData = status.map(({ statusId, name, colorCode }) => ({
      label: name,
      value: statusId,
      colorCode: colorCode,
    }));

    return ResponseData(res, 200, "success", statusData, null);
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};