const boom = require("@hapi/boom");
const notifController = require("../notification/controller");
const postController = require("../post/controller");
const replyController = require("../reply/controller");
const store = require("./store");

async function likePost(data) {
  if (data.type !== "reply" && data.type !== "post") {
    throw boom.conflict("Type property must be 'reply' or 'post'");
  }

  const like = await store.like(data);

  await sendNotification(data);

  return like;
}

async function dislikePost(data) {
  const dislike = await store.dislike(data);

  return { deletedLike: dislike };
}

async function sendNotification(like) {
  const notifInfo = {
    user_from: like.user_id,
    type: "like",
  };

  if (like.type === "post") {
    const post = await postController.getPost({ id: like.message_id });

    notifInfo.user_to = post.author.id;
    notifInfo.post_id = post.id;
  } else {
    const reply = await replyController.getReply(like.message_id);

    notifInfo.user_to = reply.author.id;
    notifInfo.post_id = reply.replying_to_post;
  }

  return await notifController.notifyUser(notifInfo);
}

module.exports = {
  likePost,
  dislikePost,
};
