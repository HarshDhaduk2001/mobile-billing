const Task = require("../models/taskModel");
const { verifyJWT } = require("../middlewares/authMiddleware");
const sequelize = require("../config/db");

exports.getAllTasks = async (req, res) => {
  try {
    const token = req.headers.authorization?.substring(7);
    if (!token) {
      return res
        .status(401)
        .json({ status: "failure", error: "Unauthorized: Token missing." });
    }

    const verify = await verifyJWT(token);
    if (!verify) {
      return res
        .status(403)
        .json({ status: "failure", error: "Invalid token." });
    }

    const pageSize = parseInt(req.body.pageSize) || 10;
    const pageNumber = parseInt(req.body.pageNumber) || 1;

    // Execute the stored procedure using Sequelize
    const [results, metadata] = await sequelize.query(
      "CALL GetAllTasksWithCount(:pageSize, :pageNumber)",
      {
        replacements: { pageSize, pageNumber },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const result = Object.values(results)
    console.log(result)
    const totalCount = result[0].totalCount;
    const paginatedResults = result[0];
    console.log(result,totalCount,paginatedResults)

    res
      .status(200)
      .json({
        status: "success",
        totalCount,
        responseData: { List: paginatedResults, TotalCount: totalCount },
      });
    // res.status(200).json({ status: "success", responseData: Object.values(results) });
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
    console.log("task", task);
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
