const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  problem: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taskStatus: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
  },
  receivedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  passwordType: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  advance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  deliverDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Task;
