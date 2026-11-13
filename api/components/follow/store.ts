import type { FollowInput, RequestOptions } from "../../types";

const { models } = require("../../../libs/sequelize");

async function followUser(data: FollowInput, options: RequestOptions = {}) {
  const follow = await models.Follow.create(data, options);
  return follow;
}

async function unfollowUser(data: FollowInput) {
  const follows = await models.Follow.destroy({
    where: {
      ...data,
    },
  });
  return follows;
}

async function getFollows({ user_id, prop, type }: {
  user_id: number;
  prop: "follow_from" | "follow_to";
  type: "followers" | "following";
}) {
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
