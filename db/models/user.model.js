const { Model, DataTypes } = require("sequelize");

const USER_TABLE = "users";

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nickname: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  bio: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  profile_photo: {
    allowNull: true,
    type: DataTypes.STRING,
  },
};

class User extends Model {
  static associate(models) {
    this.hasMany(models.Follow, {
      foreignKey: "follow_from",
      as: "following",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Follow, {
      foreignKey: "follow_to",
      as: "followers",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Notification, {
      foreignKey: "user_to",
      as: "notifications",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Notification, {
      foreignKey: "user_from",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Post, {
      foreignKey: "author_id",
      as: "posts",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Reply, {
      foreignKey: "author_id",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Reply, {
      foreignKey: "replying_to_user_id",
      onDelete: "CASCADE",
    });

    this.hasMany(models.Like, {
      foreignKey: "user_id",
      as: "liked_posts",
      onDelete: "CASCADE",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      timestamps: false,
    };
  }
}

module.exports = { USER_TABLE, UserSchema, User };
