const { models } = require("../../../libs/sequelize");

async function createReply(data, options = {}) {
  const reply = await models.Reply.create(data, options);
  return reply;
}

async function deleteReply(id, author_id) {
  const reply = await models.Reply.destroy({
    where: { id, author_id },
  });
  return reply;
}

async function getReply(id, options = {}) {
  const reply = await models.Reply.findOne({
    include: [
      {
        model: models.User,
        as: "author",
        attributes: ["id", "username", "nickname", "profile_photo"],
      },
      {
        model: models.User,
        as: "replying_to_user",
        attributes: ["username"],
      },
      {
        model: models.Like,
        as: "likes",
        attributes: ["id", "user_id"],
      },
    ],
    attributes: [
      "id",
      "content",
      "inserted_image",
      "replying_to_post",
      "createdAt",
    ],
    where: { id },
    ...options,
  });
  return reply;
}

module.exports = {
  create: createReply,
  delete: deleteReply,
  get: getReply,
};
