const boom = require("@hapi/boom");
const { getFileUrl } = require("../../../libs/multer");
const { socket } = require("../../../libs/socket");
const notifController = require("../notification/controller");
const store = require("./store");

async function createReply({
  author_id,
  content,
  replying_to_user,
  replying_to_post,
  inserted_image,
}) {
  const data = {
    author_id,
    content,
    replying_to_post,
    replying_to_user_id: replying_to_user,
  };

  if (inserted_image) {
    data.inserted_image = getFileUrl(inserted_image);
  }

  const newReply = await store.create(data);
  const reply = await getReply(newReply.id);

  socket.io.emit("new reply", { reply });

  await sendNotification(newReply);

  return reply;
}

async function deleteReply({ reply_id }) {
  await getReply(reply_id);

  await store.delete(reply_id);

  return { replyDeleted: reply_id };
}

async function getReply(reply_id) {
  const reply = await store.get(reply_id);

  if (!reply) {
    throw boom.notFound(`Reply ${reply_id} doesn't exist`);
  }

  return reply;
}

async function sendNotification(reply) {
  const notifInfo = {
    user_from: reply.author_id,
    user_to: reply.replying_to_user_id,
    post_id: reply.replying_to_post,
    type: "reply",
  };

  return await notifController.notifyUser(notifInfo);
}

module.exports = {
  createReply,
  deleteReply,
  getReply,
};
