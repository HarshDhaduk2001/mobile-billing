const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Organization = require("./organizationModel");
const Role = require("./roleModel");

const User = sequelize.define("User", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orgId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Organization,
      key: "orgId",
    },
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "roleId",
    },
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  contactNo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  shopName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  shopAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  userType: {
    type: DataTypes.INTEGER, // 1-Super Admin, 2-Admin, 3-User
    allowNull: false,
    defaultValue: 3
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
});

User.belongsTo(Organization, { foreignKey: "orgId" });
User.belongsTo(Role, { foreignKey: "roleId" });

module.exports = User;