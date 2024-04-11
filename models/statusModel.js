const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Status = sequelize.define(
  "Status",
  {
    statusId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    colorCode: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  { timestamps: false }
);

module.exports = Status;