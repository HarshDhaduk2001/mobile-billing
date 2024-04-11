const express = require("express");
const customerController = require("../controllers/customerController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/getAllTask", authenticateJWT, customerController.getAllTasks);
router.post("/", authenticateJWT, customerController.createTask);
router.post("/updateStatus", authenticateJWT, customerController.updateTaskStatus);
router.post("/exportTask", authenticateJWT, customerController.exportTasksToExcel);
router.get("/:id", authenticateJWT, customerController.getTaskById);
router.post("/:id", authenticateJWT, customerController.updateTask);

module.exports = router;
