const express = require("express");
const taskController = require("../controllers/taskController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/getAllTask", authenticateJWT, taskController.getAllTasks);
router.post("/", authenticateJWT, taskController.createTask);
router.post("/updateTask", authenticateJWT, taskController.updateTask);
router.post("/updateStatus", authenticateJWT, taskController.updateTaskStatus);
router.post("/exportTask", authenticateJWT, taskController.exportTasksToExcel);
router.get("/:id", authenticateJWT, taskController.getTaskById);

module.exports = router;
