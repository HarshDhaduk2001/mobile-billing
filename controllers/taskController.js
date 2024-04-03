const Task = require("../models/taskModel");
const sequelize = require("../config/db");
const ExcelJS = require("exceljs");
const { Op } = require("sequelize");

exports.getAllTasks = async (req, res) => {
  try {
    const token = req.headers.authorization?.substring(7);
    if (!token) {
      return res
        .status(401)
        .json({ status: "failure", error: "Unauthorized: Token missing." });
    }

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

    res.status(200).json({
      status: "success",
      responseData: {
        List: Object.values(results[1]),
        TotalCount: results[0][0].totalCount,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error." });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (isNaN(taskId) || taskId <= 0) {
      return res
        .status(400)
        .json({ status: "failure", error: "Invalid task ID" });
    }

    const task = await Task.findOne({
      where: { id: taskId },
    });

    if (!task) {
      return res
        .status(404)
        .json({ status: "failure", error: "Task not found" });
    }

    res.status(200).json({ status: "success", responseData: task });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      model,
      problem,
      passwordType,
      password,
      receivedBy,
      price,
      advance,
      taskStatus,
      deliverDate,
    } = req.body;

    const newTask = await Task.create({
      name,
      email,
      phone,
      address,
      model,
      problem,
      passwordType,
      password,
      receivedBy,
      price,
      advance,
      taskStatus,
      deliverDate,
      updatedBy: req.user.id,
    });

    res.status(201).json({
      status: "success",
      message: "Task created successfully.",
      responseData: newTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error.", error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const {
      name,
      email,
      phone,
      address,
      model,
      problem,
      password,
      passwordType,
      price,
      advance,
      receivedBy,
      taskStatus,
      deliverDate,
    } = req.body;

    if (!taskId) {
      return res
        .status(400)
        .json({ status: "failure", error: "ID is required." });
    }

    const task = await Task.findOne({
      where: { id: taskId },
    });
    if (!task) {
      return res
        .status(404)
        .json({ status: "failure", error: "Task not found." });
    }

    task.name = name;
    task.email = email;
    task.phone = phone;
    task.address = address;
    task.model = model;
    task.problem = problem;
    task.passwordType = passwordType;
    task.password = password;
    task.receivedBy = receivedBy;
    task.price = price;
    task.advance = advance;
    task.taskStatus = taskStatus;
    task.deliverDate = deliverDate;
    task.updatedBy = req.user.id;
    await task.save();

    res
      .status(200)
      .json({ status: "success", message: "Task updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error." });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId, taskStatus } = req.body;

    if (!taskId) {
      return res
        .status(400)
        .json({ status: "failure", error: "ID is required." });
    }

    const task = await Task.findOne({
      where: { id: taskId },
    });

    if (!task) {
      return res
        .status(404)
        .json({ status: "failure", error: "Task not 1 found." });
    }

    task.taskStatus = taskStatus;
    task.updatedBy = req.user.id;
    await task.save();

    res.status(200).json({
      status: "success",
      message: "Task status updated successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error." });
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
        { phone: { [Op.like]: `%${globalSearch}%` } },
        { model: { [Op.like]: `%${globalSearch}%` } },
      ];
    }

    const tasks = await Task.findAll({
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
        task.phone,
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
    console.error("Error exporting tasks to Excel:", error);
    res
      .status(500)
      .json({ status: "failure", error: "Internal Server Error." });
  }
};
