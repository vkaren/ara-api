const { Model, DataTypes, Sequelize } = require("sequelize");

const POST_TABLE = "posts";

const PostSchema = {
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

class Post extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "author_id",
      targetKey: "id",
      as: "author",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Reply, {
      foreignKey: "replying_to_post",
      as: "replies",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Like, {
      foreignKey: "post_id",
      as: "likes",
      onDelete: "CASCADE",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: POST_TABLE,
      modelName: "Post",
      timestamps: false,
    };
  }
}

module.exports = { POST_TABLE, PostSchema, Post };
