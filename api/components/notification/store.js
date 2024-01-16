const { models } = require("../../../libs/sequelize");

async function notifyUser(data) {
  const notification = await models.Notification.create(data);
  return notification;
}

async function getUserNotifications(userId) {
  const notifications = await models.Notification.findAll({
    where: { user_to: userId },
    include: [
      {
        model: models.User,
        as: "notif_from",
        attributes: ["id", "username", "nickname", "profile_photo"],
      },
    ],
    attributes: ["id", "type", "post_id", "seen"],
  });
  return notifications;
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
