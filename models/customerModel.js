const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Status = require("./statusModel");

const Customer = sequelize.define("Customer", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactNo: {
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
    references: {
      model: Status,
      key: 'id',
    },
  },
  receivedBy: {
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

Customer.belongsTo(Status, { foreignKey: 'taskStatus' });
module.exports = Customer;
