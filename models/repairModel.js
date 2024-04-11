const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Status = require("./statusModel");
const Customer = require("./customerModel");
const User = require("./userModel");
const Organization = require("./organizationModel");

const Repair = sequelize.define(
  "Repair",
  {
    repairId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "customerId",
      },
    },
    orgId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Organization,
        key: "orgId",
      },
    },
    sim: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    simTray: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    backPanel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    battery: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    brand: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    problem: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    taskStatusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: Status,
        key: "statusId",
      },
    },
    receivedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "userId",
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    advancePayment: {
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
      references: {
        model: User,
        key: "userId",
      },
    },
  },
  { timestamps: false }
);

Repair.belongsTo(Customer, { foreignKey: "customerId" });
Repair.belongsTo(Organization, { foreignKey: "orgId" });
Repair.belongsTo(User, { foreignKey: "receivedBy", as: "Receiver" });
Repair.belongsTo(User, { foreignKey: "updatedBy", as: "Updater" });
Repair.belongsTo(Status, { foreignKey: "taskStatusId" });

module.exports = Repair;
