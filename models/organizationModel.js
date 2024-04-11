const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Organization = sequelize.define("Organization", {
  orgId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = Organization;
