const { Model, DataTypes } = require("sequelize");

const LIKE_TABLE = "likes";

const LikeSchema = {
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
  post_id: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  reply_id: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
};

class Like extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id",
      onDelete: "CASCADE",
    });

    this.belongsTo(models.Post, {
      foreignKey: "post_id",
      targetKey: "id",
      onDelete: "CASCADE",
    });

    this.belongsTo(models.Reply, {
      foreignKey: "reply_id",
      targetKey: "id",
      onDelete: "CASCADE",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LIKE_TABLE,
      modelName: "Like",
      timestamps: false,
    };
  }
}

module.exports = { LIKE_TABLE, LikeSchema, Like };
