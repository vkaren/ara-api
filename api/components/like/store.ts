import type {
  LikeInput,
  LikePersistenceInput,
  RequestOptions,
} from "../../types";

const { models } = require("../../../libs/sequelize");

async function likePost(data: LikeInput, options: RequestOptions = {}) {
  const query = getQuery(data);
  const like = await models.Like.create(query, options);

  return like;
}

async function getLikes(userId: number) {
  const query: { where: { user_id: number } } = {
    where: { user_id: userId },
  };

  const likes = await models.Like.findAll(query);

  return likes;
}

async function dislikePost(data: LikeInput) {
  const query: { where: LikePersistenceInput } = {
    where: { ...getQuery(data) },
  };
  const like = await models.Like.destroy(query);

  return like;
}

function getQuery(data: LikeInput) {
  const query: LikePersistenceInput = {
    user_id: data.user_id,
  };

  if (data.type === "post") {
    query.post_id = data.message_id;
  } else {
    query.reply_id = data.message_id;
  }

  return query;
}
module.exports = {
  like: likePost,
  get: getLikes,
  dislike: dislikePost,
};
