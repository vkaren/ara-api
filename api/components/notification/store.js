const { models } = require("../../../libs/sequelize");
const { parsePagination, buildPagination } = require("../../utils/pagination");

async function notifyUser(data, options = {}) {
  const notification = await models.Notification.create(data, options);
  return notification;
}

async function getUserNotifications(userId, requestedPagination) {
  const pagination = parsePagination(requestedPagination);
  const result = await models.Notification.findAndCountAll({
    where: { user_to: userId },
    include: [
      {
        model: models.User,
        as: "notif_from",
        attributes: ["id", "username", "nickname", "profile_photo"],
      },
    ],
    attributes: ["id", "type", "post_id", "seen"],
    limit: pagination.limit,
    offset: pagination.offset,
    order: [["id", "DESC"]],
  });
  return {
    data: result.rows,
    pagination: buildPagination({ ...pagination, count: result.count }),
  };
}

async function updateUserNotifications(userId) {
  const notifications = await models.Notification.update(
    { seen: true },
    {
      where: { user_to: userId, seen: false },
    }
  );

  return notifications;
}

module.exports = {
  notify: notifyUser,
  get: getUserNotifications,
  update: updateUserNotifications,
};
