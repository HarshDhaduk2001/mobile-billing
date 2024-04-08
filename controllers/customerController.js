const Customer = require("../models/customerModel");
const sequelize = require("../config/db");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");
const { ResponseData } = require("../utils/responseData");

exports.getAllTasks = async (req, res) => {
  try {
    const pageSize = parseInt(req.body.pageSize) || 10;
    const pageNumber = parseInt(req.body.pageNumber) || 1;
    const globalSearch = req.body.globalSearch || null;
    const taskStatusID = parseInt(req.body.taskStatusID) || null;
    const receivedByID = parseInt(req.body.receivedByID) || null;

    const results = await sequelize.query(
      "CALL GetAllTasksWithCount (:pageSize, :pageNumber, :globalSearch, :taskStatusID, :receivedByID)",
      {
        replacements: {
          pageSize,
          pageNumber,
          globalSearch,
          taskStatusID,
          receivedByID,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    ResponseData(
      res,
      200,
      "success",
      {
        List: Object.values(results[1]),
        TotalCount: results[0][0].totalCount,
      },
      null
    );
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (isNaN(taskId) || taskId <= 0) {
      ResponseData(res, 200, "failure", null, "Invalid task ID.");
    }

    const task = await Customer.findOne({
      where: { id: taskId },
    });

    if (!task) {
      ResponseData(res, 200, "failure", null, "Task not found.");
    }

    ResponseData(res, 200, "success", task, null);
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.createTask = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNo,
      address,
      model,
      problem,
      password,
      receivedBy,
      price,
      advance,
      taskStatus,
      deliverDate,
    } = req.body;

    const newTask = await Customer.create({
      name,
      email,
      contactNo,
      address,
      model,
      problem,
      password,
      receivedBy,
      price,
      advance,
      taskStatus,
      deliverDate,
      updatedBy: req.user.id,
    });

    ResponseData(res, 200, "success", newTask, "Task created successfully.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const {
      name,
      email,
      contactNo,
      address,
      model,
      problem,
      password,
      price,
      advance,
      receivedBy,
      taskStatus,
      deliverDate,
    } = req.body;

    if (!taskId) {
      ResponseData(res, 200, "failure", null, "ID is required.");
    }

    const task = await Customer.findOne({
      where: { id: taskId },
    });
    if (!task) {
      ResponseData(res, 200, "failure", null, "Task not found.");
    }

    task.name = name;
    task.email = email;
    task.contactNo = contactNo;
    task.address = address;
    task.model = model;
    task.problem = problem;
    task.password = password;
    task.receivedBy = receivedBy;
    task.price = price;
    task.advance = advance;
    task.taskStatus = taskStatus;
    task.deliverDate = deliverDate;
    task.updatedBy = req.user.id;
    await task.save();

    ResponseData(res, 200, "success", null, "Task updated successfully.");
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId, taskStatus } = req.body;

    if (!taskId) {
      ResponseData(res, 200, "failure", null, "ID is required.");
    }

    const task = await Customer.findOne({
      where: { id: taskId },
    });

    if (!task) {
      ResponseData(res, 200, "failure", null, "Task not found.");
    }

    task.taskStatus = taskStatus;
    task.updatedBy = req.user.id;
    await task.save();

    ResponseData(
      res,
      200,
      "success",
      null,
      "Task status updated successfully."
    );
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.exportTasksToExcel = async (req, res) => {
  try {
    const { taskStatusID, receivedByID, globalSearch } = req.body;

    const whereCondition = {};
    if (taskStatusID) {
      whereCondition.taskStatus = taskStatusID;
    }
    if (receivedByID) {
      whereCondition.receivedBy = receivedByID;
    }
    if (globalSearch) {
      whereCondition[Op.or] = [
        { name: { [Op.like]: `%${globalSearch}%` } },
        { email: { [Op.like]: `%${globalSearch}%` } },
        { contactNo: { [Op.like]: `%${globalSearch}%` } },
        { model: { [Op.like]: `%${globalSearch}%` } },
      ];
    }

    const tasks = await Customer.findAll({
      attributes: [
        "name",
        "email",
        "phone",
        "taskStatus",
        "receivedBy",
        "model",
        "price",
      ],
      where: whereCondition,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    worksheet.addRow([
      "Name",
      "Email",
      "Phone",
      "Status",
      "Received By",
      "Model",
      "Price",
    ]);

    tasks.forEach((task) => {
      worksheet.addRow([
        task.name,
        task.email,
        task.contactNo,
        task.taskStatus,
        task.receivedBy,
        task.model,
        task.price,
      ]);
    });

    const totalPrice = tasks.reduce(
      (acc, task) => acc + parseFloat(task.price || 0),
      0
    );

    const totalRow = worksheet.addRow([
      "Total",
      "",
      "",
      "",
      "",
      "",
      totalPrice,
    ]);
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
    });

    const filename = "tasks.xlsx";
    await workbook.xlsx.writeFile(filename);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.status(200).sendFile(filename, { root: "./" });
  } catch (error) {
    ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
