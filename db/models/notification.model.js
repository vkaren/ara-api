const { Model, DataTypes } = require("sequelize");

const NOTIFICATION_TABLE = "notifications";

const NotificationSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  user_from: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  user_to: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  post_id: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  seen: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

class Notification extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_to",
      targetKey: "id",
      onDelete: "CASCADE",
    });

    this.belongsTo(models.User, {
      foreignKey: "user_from",
      targetKey: "id",
      as: "notif_from",
      onDelete: "CASCADE",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTIFICATION_TABLE,
      modelName: "Notification",
      timestamps: false,
    };
  }
}

module.exports = { NOTIFICATION_TABLE, NotificationSchema, Notification };
