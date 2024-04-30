const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Permission = require("./permissionModel");
const PermissionAction = require("./permissionActionModel");

const PermissionActionMapping = sequelize.define(
  "PermissionActionMapping",
  {
    permissionActionMappingId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Permission,
        key: "permissionId",
      },
    },
    permissionActionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: PermissionAction,
        key: "permissionActionId",
      },
    },
  },
  { timestamps: false }
);

PermissionActionMapping.belongsTo(Permission, { foreignKey: "permissionId" });

PermissionActionMapping.belongsTo(PermissionAction, {
  foreignKey: "permissionActionId",
});

module.exports = PermissionActionMapping;
