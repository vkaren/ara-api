const boom = require("@hapi/boom");
const { socket } = require("../../../libs/socket");
const store = require("./store");

async function getUserNotifications({ user_id }) {
  const notifications = await store.get(user_id);

  return notifications;
}

async function notifyUser({ user_from, user_to, type, post_id }) {
  if (!user_from || !user_to || !type) {
    throw boom.conflict("Missing properties");
  }

  if (type !== "follow" && type !== "reply" && type !== "like") {
    throw boom.conflict('Type must be a "follow", "reply" or "like"');
  }

  if (type !== "follow" && !post_id) {
    throw boom.conflict("Missing post_id property");
  }

  if (user_from === user_to) {
    return "Same user";
  }

  const data = {
    user_from,
    user_to,
    type,
    post_id,
  };

  const notification = await store.notify(data);

  socket.io.emit("new notification", { notificationFor: notification.user_to });

  return notification;
}

async function updateSeenState({ user_id }) {
  const userNotifs = await getUserNotifications({ user_id });
  let updatedNotifications = [0];

  if (userNotifs.length > 0) {
    updatedNotifications = await store.update(user_id);
  }

  return { updatedNotifications };
}

module.exports = {
  notifyUser,
  getUserNotifications,
  updateSeenState,
};
