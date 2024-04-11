const Organization = require("../models/organizationModel");
const { ResponseData } = require("../utils/responseData");
require("dotenv").config();

exports.getAllOrganizations = async (req, res) => {
  try {
    const organization = await Organization.findAll({
      attributes: ["orgId", "name", "deletedAt"],
    });

    return ResponseData(res, 200, "success", organization, null);
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getOrganizationById = async (req, res) => {
  try {
    const orgId = req.params.id;
    if (isNaN(orgId) || orgId <= 0) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        "Invalid organization ID."
      );
    }

    const organization = await Organization.findOne({
      where: { orgId, deletedAt: null },
    });

    if (!organization) {
      return ResponseData(res, 200, "failure", null, "Organization not found.");
    }

    return ResponseData(
      res,
      200,
      "success",
      {
        id: organization.orgId,
        name: organization.name,
      },
      null
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return ResponseData(res, 200, "failure", null, "Name is required.");
    }

    const existingOrganization = await Organization.findOne({
      where: { name },
    });

    if (existingOrganization) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        `Organization with name '${name}' already exists.`
      );
    }

    await Organization.create({ name });

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Organization created successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const orgId = req.params.id;
    const { name } = req.body;

    if (!name || !orgId) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        "Name and ID are required."
      );
    }

    const org = await Organization.findOne({
      where: { orgId, deletedAt: null },
    });
    if (!org) {
      return ResponseData(res, 200, "failure", null, "Organization not found.");
    }

    const orgName = await Organization.findOne({
      where: { name, deletedAt: null },
    });
    if (orgName) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        `Organization with name '${name}' already exists.`
      );
    }

    await Organization.update(
      { name },
      {
        where: { orgId },
      }
    );

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Organization updated successfully."
    );
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const orgId = req.params.id;

    if (!orgId) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        "Invalid organization ID."
      );
    }

    const org = await Organization.findOne({
      where: { orgId, deletedAt: null },
    });
    if (!org) {
      return ResponseData(res, 200, "failure", null, "Organization not found.");
    }

    await Organization.update(
      { deletedAt: new Date() },
      {
        where: { orgId },
      }
    );

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Organization has been deleted successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getOrganizationList = async (req, res) => {
  const userOrgId = req.user.orgId;
  const userType = req.user.userType;
  try {
    let org;
    if (userType === 1) {
      org = await Organization.findAll({
        attributes: ["orgId", "name"],
        where: { deletedAt: null },
      });
    } else {
      org = await Organization.findAll({
        attributes: ["orgId", "name"],
        where: { orgId: userOrgId, deletedAt: null },
      });
    }

    const orgData = org.map(({ orgId, name }) => ({
      label: name,
      value: orgId,
    }));

    return ResponseData(res, 200, "success", orgData, null);
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
