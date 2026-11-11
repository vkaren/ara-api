const { models } = require("../../../libs/sequelize");
const { parsePagination, buildPagination } = require("../../utils/pagination");

async function createPost(data) {
  const post = await models.Post.create(data);

  return post;
}

async function listPosts(author_id, requestedPagination) {
  const query = getCommonQuery();
  const pagination = parsePagination(requestedPagination);

  if (author_id) {
    query.where = { author_id };
  }

  query.limit = pagination.limit;
  query.offset = pagination.offset;
  query.order = [["createdAt", "DESC"]];

  const result = await models.Post.findAndCountAll(query);
  return {
    data: result.rows,
    pagination: buildPagination({ ...pagination, count: result.count }),
  };
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
