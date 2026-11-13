import type {
  CreateReplyInput,
  RequestOptions,
} from "../../types";

const { models } = require("../../../libs/sequelize");

async function createReply(data: CreateReplyInput, options: RequestOptions = {}) {
  const reply = await models.Reply.create(data, options);
  return reply;
}

async function deleteReply(id: number, author_id: number) {
  const reply = await models.Reply.destroy({
    where: { id, author_id },
  });
  return reply;
}

async function getReply(id: number | string, options: RequestOptions = {}) {
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
