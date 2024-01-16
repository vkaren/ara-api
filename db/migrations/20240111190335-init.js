"use strict";

const { USER_TABLE, UserSchema } = require("../models/user.model");
const { POST_TABLE, PostSchema } = require("../models/post.model");
const { REPLY_TABLE, ReplySchema } = require("../models/reply.model");
const { LIKE_TABLE, LikeSchema } = require("../models/like.model");
const {
  NOTIFICATION_TABLE,
  NotificationSchema,
} = require("../models/notification.model");
const { FOLLOW_TABLE, FollowSchema } = require("../models/follow.model");
const { AUTH_TABLE, AuthSchema } = require("../models/auth.model");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(POST_TABLE, PostSchema);
    await queryInterface.createTable(REPLY_TABLE, ReplySchema);
    await queryInterface.createTable(LIKE_TABLE, LikeSchema);
    await queryInterface.createTable(NOTIFICATION_TABLE, NotificationSchema);
    await queryInterface.createTable(FOLLOW_TABLE, FollowSchema);
    await queryInterface.createTable(AUTH_TABLE, AuthSchema);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(POST_TABLE);
    await queryInterface.dropTable(REPLY_TABLE);
    await queryInterface.dropTable(LIKE_TABLE);
    await queryInterface.dropTable(NOTIFICATION_TABLE);
    await queryInterface.dropTable(FOLLOW_TABLE);
    await queryInterface.dropTable(AUTH_TABLE);
  },
};
