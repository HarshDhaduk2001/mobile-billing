const express = require("express");
const permissionController = require("../controllers/permissionController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authenticateJWT, permissionController.getPermissionList);

module.exports = router;
