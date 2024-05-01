const express = require("express");
const roleController = require("../controllers/roleController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, roleController.getAllRole);
router.get("/roleList", authenticateJWT, roleController.getRoleList);
router.get("/:id", authenticateJWT, roleController.getRoleById);
router.post("/", authenticateJWT, roleController.createRole);
// router.post("/delete/:id", authenticateJWT, roleController.deleteRole);
router.post("/rolePermission/:id", authenticateJWT, roleController.updateRolePermission);
router.post("/:id", authenticateJWT, roleController.updateRole);

module.exports = router;
