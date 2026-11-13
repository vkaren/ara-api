import type {
  EntityId,
  RequestOptions,
  UpdateUserInput,
  UserPersistenceInput,
  UserUpdateData,
  UserInput,
} from "../../types";
import type { Transaction } from "sequelize";

const boom = require("@hapi/boom");
const { getFileUrl } = require("../../../libs/multer");
const sequelize = require("../../../libs/sequelize");
const store = require("./store");
const authController = require("../auth/controller");

async function listUsers({ filter = null }: { filter?: string | null }) {
  const list = await store.list(filter);
  return list;
}

async function getUser(
  { id }: { id: EntityId },
  options: RequestOptions = {}
) {
  const user = await store.get(id, options);

  if (!user) {
    throw boom.notFound(`User ${id} doesn't exist`);
  }

  return user;
}

async function createUser({
  nickname,
  username,
  password,
  bio,
  profile_photo,
}: UserInput) {
  return sequelize.transaction(async (transaction: Transaction) => {
    await isUsernameAlreadyCreated(username, { transaction });

    const data: UserPersistenceInput = {
      nickname,
      username,
    };

    if (bio) {
      data.bio = bio;
    }

    if (profile_photo) {
      data.profile_photo = getFileUrl(profile_photo);
    }

    const newUser = await store.create(data, { transaction });

    await authController.create(
      {
        user_id: newUser.id,
        username: newUser.username,
        password,
      },
      { transaction }
    );

    return newUser;
  });
}

async function updateUser({
  id,
  nickname,
  username,
  password,
  bio,
  profile_photo,
}: UpdateUserInput) {
  return sequelize.transaction(async (transaction: Transaction) => {
    await getUser({ id }, { transaction });

    const userData: UserUpdateData = {};
    const authData: { username?: string; password?: string } = {};

    if (username) {
      await isUsernameAlreadyCreated(username, { transaction });
      userData.username = username;
      authData.username = username;
    }

    if (password) {
      authData.password = password;
    }

    if (Object.keys(authData).length > 0) {
      await authController.update(
        { ...authData, user_id: id },
        { transaction }
      );
    }

    if (nickname) {
      userData.nickname = nickname;
    }
    if (bio) {
      userData.bio = bio;
    }
    if (profile_photo) {
      userData.profile_photo = getFileUrl(profile_photo);
    }

    return store.update(id, userData, { transaction });
  });
}

async function deleteUser({ id }: { id: EntityId }) {
  return sequelize.transaction(async (transaction: Transaction) => {
    await getUser({ id }, { transaction });
    await store.delete(id, { transaction });
    await authController.delete(id, { transaction });

    return { userDeleted: id };
  });
}

async function isUsernameAlreadyCreated(
  username: string,
  options: RequestOptions = {}
) {
  const isAlreadyCreated = await store.get(username, options);

  if (isAlreadyCreated) {
    throw boom.conflict(`Username ${username} already exists`);
  }

  return false;
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
