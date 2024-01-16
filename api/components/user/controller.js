const boom = require("@hapi/boom");
const { getFileUrl } = require("../../../libs/multer");
const store = require("./store");
const authController = require("../auth/controller");

async function listUsers() {
  const list = await store.list();
  return list;
}

async function getUser({ id }) {
  const user = await store.get(id);

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
}) {
  await isUsernameAlreadyCreated(username);

  const data = {
    nickname,
    username,
  };

  if (bio) {
    data.bio = bio;
  }

  if (profile_photo) {
    data.profile_photo = getFileUrl(profile_photo);
  }

  const newUser = await store.create(data);

  await authController.create({
    user_id: newUser.id,
    username: newUser.username,
    password,
  });

  return newUser;
}

async function updateUser({
  id,
  nickname,
  username,
  password,
  bio,
  profile_photo,
}) {
  await getUser({ id });

  const data = {};

  if (username || password) {
    if (username) {
      await isUsernameAlreadyCreated(username);

      data.username = username;
    }

    if (password) {
      data.password = password;
    }

    await authController.update({ ...data, user_id: id });
  }

  if (nickname) {
    data.nickname = nickname;
  }
  if (bio) {
    data.bio = bio;
  }
  if (profile_photo) {
    data.profile_photo = getFileUrl(profile_photo);
  }

  const newUser = await store.update(id, data);
  return newUser;
}

async function deleteUser({ id }) {
  await getUser({ id });

  await store.delete(id);
  await authController.delete(id);

  return { userDeleted: id };
}

async function isUsernameAlreadyCreated(username) {
  const isAlreadyCreated = await store.get(username);

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
