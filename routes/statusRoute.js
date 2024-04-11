const express = require("express");
const statusController = require("../controllers/statusController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, statusController.getAllStatus);
router.get("/statuslist", authenticateJWT, statusController.getStatusList);
router.get("/:id", authenticateJWT, statusController.getStatusById);
router.post("/", authenticateJWT, statusController.createStatus);
router.post("/delete/:id", authenticateJWT, statusController.deleteStatus);
router.post("/:id", authenticateJWT, statusController.updateStatus);

module.exports = router;
