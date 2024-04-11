const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Customer = sequelize.define(
  "Customer",
  {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    contactNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Customer;
