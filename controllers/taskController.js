const Customer = require("../models/customerMode");
const sequelize = require("../config/db");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const { ResponseData } = require("../utils/responseData");
const Repair = require("../models/repairModel");
const Status = require("../models/statusModel");
const User = require("../models/userModel");

exports.getAllTasks = async (req, res) => {
  try {
    const pageSize = parseInt(req.body.pageSize) || 10;
    const pageNumber = parseInt(req.body.pageNumber) || 1;
    const globalSearch = req.body.globalSearch || null;
    const taskStatusId = parseInt(req.body.taskStatusId) || null;
    const receivedBy = parseInt(req.body.receivedBy) || null;
    const updatedBy = parseInt(req.body.updatedBy) || null;
    const isDownload = false;
    const orgId = req.user.orgId;
    const userType = req.user.userType;

    const repairDetails = await Repair.sequelize.query(
      "CALL GetAllTasks(:pageSize, :pageNumber, :globalSearch, :taskStatusId, :receivedBy, :updatedBy, :orgId, :userType, :isDownload)",
      {
        replacements: {
          pageSize,
          pageNumber,
          globalSearch,
          taskStatusId,
          receivedBy,
          updatedBy,
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
        List: Object.values(repairDetails[1]),
        TotalCount: repairDetails[0][0].totalCount,
      },
      Message: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ResponseStatus: "failure",
      ResponseData: null,
      Message: "Internal Server Error.",
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const repairId = req.params.id;
    if (isNaN(repairId) || repairId <= 0) {
      return ResponseData(res, 200, "failure", null, "Invalid task ID.");
    }

    const repairDetails = await Repair.findByPk(repairId, {
      include: [
        {
          model: Customer,
          attributes: ["customerId", "name", "email", "contactNo", "address"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["userId", "name"],
        },
        {
          model: User,
          as: "Updater",
          attributes: ["userId", "name"],
        },
        {
          model: Status,
          attributes: ["statusId", "name", "colorCode"],
        },
      ],
    });

    if (!repairDetails) {
      return ResponseData(res, 200, "failure", null, "Task not found.");
    }

    const responseData = {
      id: Number(repairId),
      customerId: repairDetails.Customer.customerId,
      name: repairDetails.Customer.name,
      email: repairDetails.Customer.email,
      contactNo: repairDetails.Customer.contactNo,
      address: repairDetails.Customer.address,
      sim: repairDetails.sim,
      simTray: repairDetails.simTray,
      backPanel: repairDetails.backPanel,
      battery: repairDetails.battery,
      brand: repairDetails.brand,
      model: repairDetails.model,
      problem: repairDetails.problem,
      taskStatusId: repairDetails.Status.statusId,
      taskStatusName: repairDetails.Status.name,
      taskStatusColorCode: repairDetails.Status.colorCode,
      receivedBy: repairDetails.Receiver.userId,
      receivedByName: repairDetails.Receiver.name,
      password: repairDetails.password,
      price: repairDetails.price,
      advancePayment: repairDetails.advancePayment,
      deliverDate: repairDetails.deliverDate,
      updatedBy: repairDetails.Updater.userId,
      updatedByName: repairDetails.Updater.name,
    };

    return ResponseData(res, 200, "success", responseData, null);
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.createTask = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNo,
      address,
      sim,
      simTray,
      backPanel,
      battery,
      brand,
      model,
      problem,
      taskStatusId,
      receivedBy,
      password,
      price,
      advancePayment,
      deliverDate,
    } = req.body;

    let customer = await Customer.findOne({
      where: {
        email,
      },
    });

    if (customer) {
      if (customer.contactNo !== contactNo) {
        await Customer.update({ contactNo }, { where: { email } });
      }
    } else {
      customer = await Customer.create({
        name,
        email,
        contactNo,
        address,
        updatedBy: req.user.id,
      });
    }

    await Repair.create({
      customerId: customer.customerId,
      orgId: req.user.orgId,
      sim,
      simTray,
      backPanel,
      battery,
      brand,
      model,
      problem,
      taskStatusId,
      receivedBy,
      password,
      price,
      advancePayment,
      deliverDate,
      updatedBy: req.user.id,
    });

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Task created successfully."
    );
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const {
      id,
      sim,
      simTray,
      backPanel,
      battery,
      brand,
      model,
      problem,
      taskStatusId,
      receivedBy,
      password,
      price,
      advancePayment,
      deliverDate,
    } = req.body;

    if (!id) {
      return ResponseData(res, 200, "failure", null, "ID is required.");
    }

    let repair = await Repair.findByPk(id);

    if (!repair) {
      return ResponseData(res, 404, "failure", null, "Task not found.");
    }

    await Repair.update(
      {
        sim,
        simTray,
        backPanel,
        battery,
        brand,
        model,
        problem,
        taskStatusId,
        receivedBy,
        password,
        price,
        advancePayment,
        deliverDate,
        updatedBy: req.user.id,
      },
      {
        where: { repairId: id },
      }
    );

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Task updated successfully."
    );
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id, taskStatusId } = req.body;

    if (!id) {
      return ResponseData(res, 200, "failure", null, "ID is required.");
    }

    const task = Repair.findByPk(id);

    if (!task) {
      return ResponseData(res, 200, "failure", null, "Task not found.");
    }

    await Repair.update(
      {
        taskStatusId,
        updatedBy: req.user.id,
      },
      {
        where: { repairId: id },
      }
    );

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Task status updated successfully."
    );
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.exportTasksToExcel = async (req, res) => {
  try {
    const pageSize = parseInt(req.body.pageSize) || 10;
    const pageNumber = parseInt(req.body.pageNumber) || 1;
    const globalSearch = req.body.globalSearch || null;
    const taskStatusId = parseInt(req.body.taskStatusId) || null;
    const receivedBy = parseInt(req.body.receivedBy) || null;
    const updatedBy = parseInt(req.body.updatedBy) || null;
    const isDownload = true;
    const orgId = req.user.orgId;
    const userType = req.user.userType;

    const responseData = await Repair.sequelize.query(
      "CALL GetAllTasks(:pageSize, :pageNumber, :globalSearch, :taskStatusId, :receivedBy, :updatedBy, :orgId, :userType, :isDownload)",
      {
        replacements: {
          pageSize,
          pageNumber,
          globalSearch,
          taskStatusId,
          receivedBy,
          updatedBy,
          orgId,
          userType,
          isDownload,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const repairDetails = Object.values(responseData[1]);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Email", key: "email" },
      { header: "Contact No", key: "contactNo" },
      { header: "Address", key: "address" },
      { header: "Sim", key: "sim" },
      { header: "Sim Tray", key: "simTray" },
      { header: "Back Panel", key: "backPanel" },
      { header: "Battery", key: "battery" },
      { header: "Brand", key: "brand" },
      { header: "Model", key: "model" },
      { header: "Problem", key: "problem" },
      { header: "Status", key: "statusName" },
      { header: "Received By", key: "receivedByName" },
      { header: "Password", key: "password" },
      { header: "Price", key: "price" },
      { header: "Advance Payment", key: "advancePayment" },
      { header: "Delivery Date", key: "deliverDate" },
      { header: "Updated By", key: "updatedByName" },
    ];

    repairDetails.forEach((repair) => {
      worksheet.addRow({
        id: repair.id,
        name: repair.customerName,
        email: repair.customerEmail,
        contactNo: repair.customerContactNo,
        address: repair.customerAddress,
        sim: repair.sim === 1 ? true : false,
        simTray: repair.simTray === 1 ? true : false,
        backPanel: repair.backPanel === 1 ? true : false,
        battery: repair.battery === 1 ? true : false,
        brand: repair.brand,
        model: repair.model,
        problem: repair.problem,
        statusName: repair.taskStatusName,
        receivedByName: repair.receivedByName,
        password: repair.password,
        price: repair.price,
        advancePayment: repair.advancePayment,
        deliverDate: repair.deliverDate,
        updatedByName: repair.updatedByName,
      });
    });

    const totalPrice =
      repairDetails.length > 0 &&
      repairDetails.reduce((acc, task) => acc + parseFloat(task.price || 0), 0);

    const totalAdvancePrice =
      repairDetails.length > 0 &&
      repairDetails.reduce(
        (acc, task) => acc + parseFloat(task.advancePayment || 0),
        0
      );

    const totalRow =
      repairDetails.length > 0 &&
      worksheet.addRow([
        "Total",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        totalPrice,
        totalAdvancePrice,
        "",
        "",
      ]);
    repairDetails.length > 0 &&
      totalRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" },
        };
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

    const filename = "tasks.xlsx";
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
