const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotpassword);
router.post("/reset-password", authController.resetPassword);
router.post("/delete/:id", authController.deleteUser);

module.exports = router;
