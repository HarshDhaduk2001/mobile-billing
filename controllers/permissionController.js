const Role = require("../models/roleModel");
const { ResponseData } = require("../utils/responseData");
const sequelize = require("../config/db");

exports.getPermissionList = async (req, res) => {
  try {
    const roleId = parseInt(req.body.roleId);

    const roleDetails = await Role.sequelize.query(
      "CALL getPermissionList(:roleId)",
      {
        replacements: {
          roleId,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const mergedList = Object.values(roleDetails[0]).map((item) => {
      const matchingChildren = Object.values(roleDetails[1]).filter(
        (child) => child.parentId === item.permissionId
      );
      const newItem = { ...item };
      if (matchingChildren.length > 0) {
        newItem.children = matchingChildren;
      } else {
        newItem.children = [];
      }
      return newItem;
    });

    return res.status(200).json({
      ResponseStatus: "success",
      ResponseData: mergedList,
      Message: null,
    });
  } catch (error) {
    console.error(error);
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
