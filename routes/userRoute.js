const express = require("express");
const userController = require("../controllers/userController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotpassword);
router.post("/reset-password", userController.resetPassword);
router.get("/", authenticateJWT, userController.getAllUsers);
router.post("/updateUser", authenticateJWT, userController.updateUser);
router.post("/delete/:id", authenticateJWT, userController.deleteUser);

module.exports = router;