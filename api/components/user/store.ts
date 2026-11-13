import type {
  RequestOptions,
  UserQuery,
  UserPersistenceInput,
  UserUpdateData,
} from "../../types";

const { Op } = require("sequelize");
const { models } = require("../../../libs/sequelize");

async function createUser(
  data: UserPersistenceInput,
  options: RequestOptions = {}
) {
  const user = await models.User.create(data, options);
  return user;
}

async function updateUser(
  id: number,
  data: UserUpdateData,
  options: RequestOptions = {}
) {
  const userToUpdate = await getUser(id, options);
  const updatedUser = await userToUpdate.update({
    ...data,
  }, options);

  return updatedUser;
}

async function deleteUser(id: number, options: RequestOptions = {}) {
  const userDeleted = await models.User.destroy({
    where: { id },
    ...options,
  });

  return userDeleted;
}

async function listUsers(filter?: string | null) {
  const query: UserQuery = {
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

async function getUser(param: number | string, options: RequestOptions = {}) {
  try {
    const query: UserQuery = {
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

    if (isNaN(Number(param))) {
      query.where = { username: param };
    } else {
      query.where = { id: Number(param) };
    }

    const list = await models.User.findOne({ ...query, ...options });
    return list;
  } catch (err) {
    throw new Error(err);
  }
}

async function getUserByEmail(
  email: string,
  options: RequestOptions = {},
  excludeUserId?: number
) {
  const where: Record<string, unknown> = { email };

  if (excludeUserId) {
    where.id = { [Op.ne]: excludeUserId };
  }

  return models.User.findOne({
    where,
    ...options,
  });
}

module.exports = {
  create: createUser,
  update: updateUser,
  delete: deleteUser,
  list: listUsers,
  get: getUser,
  getByEmail: getUserByEmail,
};
