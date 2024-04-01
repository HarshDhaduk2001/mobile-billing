const express = require("express");
const statusController = require("../controllers/statusController");
const router = express.Router();

router.get("/", statusController.getAllStatus);
router.get("/statuslist", statusController.getStatusList);
router.get("/:id", statusController.getStatusById);
router.post("/", statusController.createStatus);
router.post("/delete/:id", statusController.deleteStatus);
router.post("/:id", statusController.updateStatus);

module.exports = router;
