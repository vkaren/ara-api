const { Model, DataTypes } = require("sequelize");

const AUTH_TABLE = "auth";

const AuthSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  user_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
};

class Auth extends Model {
  static associate() {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: AUTH_TABLE,
      modelName: "Auth",
      timestamps: false,
    };
  }
}

module.exports = { AUTH_TABLE, AuthSchema, Auth };
