const { Model, DataTypes } = require("sequelize");

const FOLLOW_TABLE = "follows";

const FollowSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  follow_from: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  follow_to: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
};

class Follow extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "follow_from",
      targetKey: "id",
      onDelete: "CASCADE",
    });

    this.belongsTo(models.User, {
      foreignKey: "follow_to",
      targetKey: "id",
      onDelete: "CASCADE",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: FOLLOW_TABLE,
      modelName: "Follow",
      timestamps: false,
    };
  }
}

module.exports = { FOLLOW_TABLE, FollowSchema, Follow };
