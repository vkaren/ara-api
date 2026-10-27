const boom = require("@hapi/boom");
const { getFileUrl } = require("../../../libs/multer");
const { socket } = require("../../../libs/socket");
const sequelize = require("../../../libs/sequelize");
const notifController = require("../notification/controller");
const store = require("./store");

async function createReply({
  author_id,
  content,
  replying_to_user,
  replying_to_post,
  inserted_image,
}) {
  const reply = await sequelize.transaction(async (transaction) => {
    const data = {
      author_id,
      content,
      replying_to_post,
      replying_to_user_id: replying_to_user,
    };

    if (inserted_image) {
      data.inserted_image = getFileUrl(inserted_image);
    }

    const newReply = await store.create(data, { transaction });
    const reply = await getReply(newReply.id, { transaction });

    await sendNotification(newReply, { transaction });

    return reply;
  });

  socket.io.emit("new reply", { reply });

  return reply;
}

async function deleteReply({ author_id, reply_id }) {
  await getReply(reply_id);

  const deletedReplies = await store.delete(reply_id, author_id);

  if (deletedReplies === 0) {
    throw boom.forbidden("You cannot delete this reply");
  }

  return { replyDeleted: reply_id };
}

async function getReply(reply_id, options = {}) {
  const reply = await store.get(reply_id, options);

  if (!reply) {
    throw boom.notFound(`Reply ${reply_id} doesn't exist`);
  }

  return reply;
}

async function sendNotification(reply, options = {}) {
  const notifInfo = {
    user_from: reply.author_id,
    user_to: reply.replying_to_user_id,
    post_id: reply.replying_to_post,
    type: "reply",
  };

  return await notifController.notifyUser(notifInfo, options);
}

module.exports = {
  createReply,
  deleteReply,
  getReply,
};
