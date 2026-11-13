import type {
  LikeInput,
  NotificationInput,
  RequestOptions,
} from "../../types";
import type { Transaction } from "sequelize";

const boom = require("@hapi/boom");
const { socket } = require("../../../libs/socket");
const sequelize = require("../../../libs/sequelize");
const notifController = require("../notification/controller");
const postController = require("../post/controller");
const replyController = require("../reply/controller");
const store = require("./store");

async function likePost(data: LikeInput) {
  if (data.type !== "reply" && data.type !== "post") {
    throw boom.conflict("Type property must be 'reply' or 'post'");
  }

  const like = await sequelize.transaction(async (transaction: Transaction) => {
    const like = await store.like(data, { transaction });
    await sendNotification(data, { transaction });
    return like;
  });

  socket.io.emit("new like", { like: data });

  return like;
}

async function getLikes({ id }: { id: number }) {
  const likes = await store.get(id);

  return likes;
}

async function dislikePost(data: LikeInput) {
  await store.dislike(data);

  socket.io.emit("new dislike", { dislike: data });

  return { deletedLike: data };
}

async function sendNotification(
  like: LikeInput,
  options: RequestOptions = {}
) {
  const notifInfo: NotificationInput = {
    user_from: like.user_id,
    user_to: 0,
    type: "like",
  };

  if (like.type === "post") {
    const post = await postController.getPost(
      { id: like.message_id },
      options
    );

    notifInfo.user_to = post.author.id;
    notifInfo.post_id = post.id;
  } else {
    const reply = await replyController.getReply(like.message_id, options);

    notifInfo.user_to = reply.author.id;
    notifInfo.post_id = reply.replying_to_post;
  }

  return await notifController.notifyUser(notifInfo, options);
}

module.exports = {
  likePost,
  getLikes,
  dislikePost,
};
