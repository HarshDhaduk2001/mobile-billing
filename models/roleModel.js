const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Organization = require("./organizationModel");

const Role = sequelize.define(
  "Role",
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Organization,
        key: "orgId",
      },
    },
    roleActionMapping: { type: DataTypes.TEXT, allowNull: true },
  },
  { timestamps: false }
);

Role.belongsTo(Organization, { foreignKey: "orgId" });

module.exports = Role;
