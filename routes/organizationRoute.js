const express = require("express");
const organizationController = require("../controllers/organizationController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", authenticateJWT, organizationController.getAllOrganizations);
router.get(
  "/organizationlist",
  authenticateJWT,
  organizationController.getOrganizationList
);
router.get("/:id", authenticateJWT, organizationController.getOrganizationById);
router.post("/", organizationController.createOrganization);
router.post(
  "/toggle/:id",
  authenticateJWT,
  organizationController.toggleOrganization
);
router.post("/:id", authenticateJWT, organizationController.updateOrganization);

module.exports = router;
