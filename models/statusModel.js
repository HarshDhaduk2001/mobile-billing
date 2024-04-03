const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Status = sequelize.define("Status", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  colorCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
});

module.exports = Status;
