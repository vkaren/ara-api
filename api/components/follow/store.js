const { models } = require("../../../libs/sequelize");

async function followUser(data) {
  const follow = await models.Follow.create(data);
  return follow;
}

async function unfollowUser(data) {
  const follows = await models.Follow.destroy({
    where: {
      ...data,
    },
  });
  return follows;
}

async function getFollows({ user_id, prop, type }) {
  const query = {
    where: {
      [prop]: user_id,
    },
    attributes: ["id"],
  };

  if (type === "followers") {
    query.attributes.push("follow_from");
  } else {
    query.attributes.push("follow_to");
  }

  const follows = await models.Follow.findAll(query);

  return follows;
}

module.exports = {
  follow: followUser,
  unfollow: unfollowUser,
  get: getFollows,
};
