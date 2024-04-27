const express = require("express");
const userController = require("../controllers/userController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotpassword);
router.post("/reset-password", userController.resetPassword);
router.post("/", authenticateJWT, userController.getAllUsers);
router.get("/getUserDetails", authenticateJWT, userController.getUserDetails);
router.post("/createUser", authenticateJWT, userController.createUser);
router.post("/updateUser/:id", authenticateJWT, userController.updateUser);
router.get("/getUserById/:id", authenticateJWT, userController.getUserById);
router.post("/user/export", authenticateJWT, userController.exportUsersToExcel);
router.post("/toggle/:id", authenticateJWT, userController.toggleUser);

module.exports = router;
