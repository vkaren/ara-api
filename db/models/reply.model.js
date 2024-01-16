const { Model, DataTypes, Sequelize } = require("sequelize");

const REPLY_TABLE = "replies";

const ReplySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  author_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  replying_to_user_id: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  replying_to_post: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  content: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  inserted_image: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class Reply extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "author_id",
      targetKey: "id",
      as: "author",
      onDelete: "CASCADE",
    });

    this.belongsTo(models.User, {
      foreignKey: "replying_to_user_id",
      targetKey: "id",
      as: "replying_to_user",
      onDelete: "CASCADE",
    });

    this.belongsTo(models.Post, {
      foreignKey: "replying_to_post",
      targetKey: "id",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Like, {
      foreignKey: "reply_id",
      as: "likes",
      onDelete: "CASCADE",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: REPLY_TABLE,
      modelName: "Reply",
      timestamps: false,
    };
  }
}

module.exports = { REPLY_TABLE, ReplySchema, Reply };
