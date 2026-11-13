import type {
  NotificationInput,
  PaginationQuery,
  RequestOptions,
} from "../../types";

const boom = require("@hapi/boom");
const { socket } = require("../../../libs/socket");
const store = require("./store");

async function getUserNotifications({
  user_id,
  page = null,
  limit = null,
}: PaginationQuery & { user_id: number }) {
  const notifications = await store.get(user_id, { page, limit });

  return notifications;
}

async function notifyUser(
  { user_from, user_to, type, post_id }: NotificationInput,
  options: RequestOptions = {}
) {
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

  const notification = await store.notify(data, options);

  socket.io.emit("new notification", { notificationFor: notification.user_to });

  return notification;
}

async function updateSeenState({ user_id }: { user_id: number }) {
  const userNotifs = await getUserNotifications({ user_id });
  let updatedNotifications = [0];

  if (userNotifs.data.length > 0) {
    updatedNotifications = await store.update(user_id);
  }

  return { updatedNotifications };
}

module.exports = {
  notifyUser,
  getUserNotifications,
  updateSeenState,
};
