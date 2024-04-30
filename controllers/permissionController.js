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

    return res.status(200).json({
      ResponseStatus: "success",
      ResponseData: {
        List: Object.values(roleDetails[1]),
      },
      Message: null,
    });
  } catch (error) {
    console.error(error)
    return ResponseData(res, 500, "failure", null, "Internal Server Error.");
  }
};
