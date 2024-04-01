const express = require("express");
const clientController = require("../controllers/taskController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/getAllTask", authenticateJWT, clientController.getAllTasks);
router.post("/", authenticateJWT, clientController.createTask);
router.post("/updateStatus", authenticateJWT, clientController.updateTaskStatus);
router.post("/:id", authenticateJWT, clientController.updateTask);

module.exports = router;
