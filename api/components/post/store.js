const { models } = require("../../../libs/sequelize");

async function createPost(data) {
  const post = await models.Post.create(data);

  return post;
}

async function listPosts(author_id) {
  const query = getCommonQuery();

  if (author_id) {
    query.where = { author_id };
  }

  const posts = await models.Post.findAll(query);
  return posts;
}

async function getPost(id, options = {}) {
  const query = getCommonQuery();
  query.where = { id };

  const post = await models.Post.findOne({ ...query, ...options });

  return post;
}

async function deletePost(id, author_id) {
  const post = await models.Post.destroy({
    where: { id, author_id },
  });

  return post;
}

function getCommonQuery() {
  const authorAssociation = {
    model: models.User,
    as: "author",
    attributes: ["id", "username", "nickname", "profile_photo"],
  };

  const likesAssociation = {
    model: models.Like,
    as: "likes",
    attributes: ["id", "user_id"],
  };

  const repliesAssociation = {
    model: models.Reply,
    as: "replies",
    include: [
      { ...authorAssociation },
      {
        model: models.User,
        as: "replying_to_user",
        attributes: ["username"],
      },
      { ...likesAssociation },
    ],
    attributes: [
      "id",
      "content",
      "inserted_image",
      "replying_to_post",
      "createdAt",
    ],
  };

  return {
    include: [
      { ...authorAssociation },
      { ...repliesAssociation },
      { ...likesAssociation },
    ],
    attributes: ["id", "content", "inserted_image", "createdAt"],
  };
}

module.exports = {
  create: createPost,
  list: listPosts,
  get: getPost,
  delete: deletePost,
};
