const { User, UserSchema } = require("./user.model");
const { Auth, AuthSchema } = require("./auth.model");
const { Follow, FollowSchema } = require("./follow.model");
const { Notification, NotificationSchema } = require("./notification.model");
const { Post, PostSchema } = require("./post.model");
const { Reply, ReplySchema } = require("./reply.model");
const { Like, LikeSchema } = require("./like.model");

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Auth.init(AuthSchema, Auth.config(sequelize));
  Follow.init(FollowSchema, Follow.config(sequelize));
  Notification.init(NotificationSchema, Notification.config(sequelize));
  Post.init(PostSchema, Post.config(sequelize));
  Reply.init(ReplySchema, Reply.config(sequelize));
  Like.init(LikeSchema, Like.config(sequelize));

  User.associate(sequelize.models);
  Follow.associate(sequelize.models);
  Notification.associate(sequelize.models);
  Post.associate(sequelize.models);
  Reply.associate(sequelize.models);
  Like.associate(sequelize.models);
}

module.exports = setupModels;
