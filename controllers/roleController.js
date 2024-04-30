const Organization = require("../models/organizationModel");
const Role = require("../models/roleModel");
const { ResponseData } = require("../utils/responseData");
require("dotenv").config();

exports.getAllRole = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: {
        model: Organization,
        attributes: ["name"],
      },
    });

    const formattedRoles = roles.map((role) => ({
      roleId: role.roleId,
      name: role.name,
      orgId: role.orgId,
      organizationName: role.Organization ? role.Organization.name : null,
    }));

    return ResponseData(res, 200, "success", formattedRoles, null);
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    if (isNaN(roleId) || roleId <= 0) {
      return ResponseData(res, 200, "failure", null, "Invalid role ID.");
    }

    const role = await Role.findOne({
      where: { roleId },
    });

    if (!role) {
      return ResponseData(res, 200, "failure", null, "Role not found.");
    }

    return ResponseData(res, 200, "success", role, null);
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, roleActionMapping } = req.body;
    const orgId = req.user.orgId;

    if (!name) {
      return ResponseData(res, 200, "failure", null, "Name is required.");
    }

    let formattedRoleActionMapping = null;
    if (Array.isArray(roleActionMapping) && roleActionMapping.length > 0) {
      formattedRoleActionMapping = roleActionMapping.join(",");
    }

    const existingRole = await Role.findOne({ where: { name, orgId } });
    if (existingRole) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        `Role '${name}' already exists for the organization.`
      );
    }

    await Role.create({
      name,
      orgId,
      roleActionMapping: formattedRoleActionMapping,
    });

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Role created successfully."
    );
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const orgId = req.user.orgId;
    const { name, roleActionMapping } = req.body;

    if (!name) {
      return ResponseData(res, 200, "failure", null, "Name is required.");
    }

    const role = await Role.findOne({
      where: { roleId },
    });
    if (!role) {
      return ResponseData(res, 200, "failure", null, "Role not found.");
    }

    const existingRole = await Role.findOne({ where: { name, orgId } });
    if (existingRole && existingRole.roleId != roleId) {
      return ResponseData(
        res,
        200,
        "failure",
        null,
        `Role '${name}' already exists for the organization.`
      );
    }

    let formattedRoleActionMapping = null;
    if (Array.isArray(roleActionMapping) && roleActionMapping.length > 0) {
      formattedRoleActionMapping = roleActionMapping.join(",");
    }

    role.name = name;
    role.roleActionMapping = formattedRoleActionMapping;
    await role.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Role updated successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    if (!roleId) {
      return ResponseData(res, 200, "failure", null, "Invalid role ID.");
    }

    const role = await Role.findOne({
      where: { roleId },
    });
    if (!role) {
      return ResponseData(res, 200, "failure", null, "Role not found.");
    }

    role.deletedAt = new Date();
    await role.save();

    return ResponseData(
      res,
      200,
      "success",
      null,
      "Role has been deleted successfully."
    );
  } catch (error) {
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
