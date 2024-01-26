const { Op } = require("sequelize");
const { models } = require("../../../libs/sequelize");

async function createUser(data) {
  const user = await models.User.create(data);
  return user;
}

async function updateUser(id, data) {
  const userToUpdate = await getUser(id);
  const updatedUser = await userToUpdate.update({
    ...data,
  });

  return updatedUser;
}

async function deleteUser(id) {
  const userDeleted = await models.User.destroy({
    where: { id },
  });

  return userDeleted;
}

async function listUsers(filter) {
  const query = {
    attributes: ["id", "username", "nickname", "profile_photo"],
  };

  if (filter) {
    query.where = {
      [Op.or]: [
        { nickname: filter },
        {
          username: filter,
        },
      ],
    };
  }

  const list = await models.User.findAll(query);

  return list;
}

async function getUser(param) {
  try {
    const query = {
      include: [
        {
          model: models.Follow,
          as: "followers",
          attributes: ["id", "follow_from"],
        },
        {
          model: models.Follow,
          as: "following",
          attributes: ["id", "follow_to"],
        },
        {
          model: models.Notification,
          as: "notifications",
          include: [
            {
              model: models.User,
              as: "notif_from",
              attributes: ["id", "username", "nickname", "profile_photo"],
            },
          ],
          attributes: ["id", "type", "post_id", "seen"],
        },
        {
          model: models.Post,
          as: "posts",
          attributes: ["id", "content", "inserted_image", "createdAt"],
          include: [
            {
              model: models.User,
              as: "author",
              attributes: ["id", "username", "nickname", "profile_photo"],
            },
            {
              model: models.Like,
              as: "likes",
              attributes: ["id", "user_id"],
            },
          ],
        },
        {
          model: models.Like,
          as: "liked_posts",
          attributes: ["id", "post_id", "reply_id"],
        },
      ],
    };

    if (isNaN(param - "")) {
      query.where = { username: param };
    } else {
      query.where = { id: param - "" };
    }

    const list = await models.User.findOne(query);
    return list;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  list: listUsers,
  get: getUser,
};
