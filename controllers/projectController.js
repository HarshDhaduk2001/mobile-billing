const Project = require("../models/projectModel");
const { verifyJWT } = require("../middlewares/authMiddleware");
require("dotenv").config();

exports.getAllProjects = async (req, res) => {
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

    const projects = await Project.findAll({
      where: { userId: req.user.id, deletedAt: null },
    });
    res.status(200).json({ status: "success", responseData:projects });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (isNaN(projectId) || projectId <= 0) {
      return res
        .status(400)
        .json({ status: "failure", error: "Invalid project ID" });
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id, deletedAt: null },
    });

    if (!project) {
      return res
        .status(404)
        .json({ status: "failure", error: "Project not found" });
    }

    res.status(200).json({ status: "success", responseData: project });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ status: "failure", error: "Name is required" });
    }

    const newProject = await Project.create({ name, userId: req.user.id });

    res.status(201).json({
      status: "success",
      message: "Project created successfully",
      responseData: newProject,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name } = req.body;

    if (!name || !projectId) {
      return res
        .status(400)
        .json({ status: "failure", error: "Name and ID are required" });
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id, deletedAt: null },
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "failure", error: "Project not found" });
    }

    project.name = name;
    await project.save();

    res
      .status(200)
      .json({ status: "success", message: "Project updated successfully" });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    if (!projectId) {
      return res
        .status(400)
        .json({ status: "failure", error: "Invalid project ID" });
    }

    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id, deletedAt: null },
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "failure", error: "Project not found" });
    }

    project.deletedAt = new Date();
    await project.save();

    res
      .status(200)
      .json({ status: "success", message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "failure", error: "Internal Server Error" });
  }
};
