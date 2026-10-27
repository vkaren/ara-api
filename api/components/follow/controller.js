const notifController = require("../notification/controller");
const sequelize = require("../../../libs/sequelize");
const store = require("./store");

async function followUser({ follow_from, follow_to }) {
  return sequelize.transaction(async (transaction) => {
    const follow = await store.follow(
      {
        follow_from,
        follow_to,
      },
      { transaction }
    );

    await sendNotification(follow, { transaction });

    return follow;
  });
}

async function unfollowUser({ follow_from, follow_to }) {
  await store.unfollow({
    follow_from,
    follow_to,
  });

  return { unfollowUser: follow_to };
}

async function getFollows({ user_id, type }) {
  const data = {
    user_id,
    type,
  };

  if (data.type === "followers") {
    data.prop = "follow_to";
  } else {
    data.prop = "follow_from";
  }

  const follow = await store.get(data);

  return follow;
}

async function sendNotification(follow, options = {}) {
  const notifInfo = {
    user_from: follow.follow_from,
    user_to: follow.follow_to,
    type: "follow",
  };

  return await notifController.notifyUser(notifInfo, options);
}

module.exports = {
  followUser,
  unfollowUser,
  getFollows,
};
