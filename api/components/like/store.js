const { models } = require("../../../libs/sequelize");

async function likePost(data) {
  try {
    const query = getQuery(data);
    const like = await models.Like.create(query);

    return like;
  } catch (err) {
    console.log(err);
  }
}

async function dislikePost(data) {
  const query = {
    where: { ...getQuery(data) },
  };
  const like = await models.Like.destroy(query);

  return like;
}

function getQuery(data) {
  const query = {
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
  dislike: dislikePost,
};
