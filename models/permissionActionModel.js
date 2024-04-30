const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PermissionAction = sequelize.define(
  "PermissionAction",
  {
    permissionActionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = PermissionAction;
