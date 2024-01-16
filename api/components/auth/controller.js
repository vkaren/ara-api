const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const auth = require("../../auth");
const store = require("./store");

async function login({ username, password }) {
  const user = await store.get(username);

  if (!user) {
    throw boom.conflict(`User ${username} doesn't exist`);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (validPassword) {
    const data = {
      id: user.user_id,
      username: user.username,
    };
    const token = auth.sign(data);

    return { user_id: user.user_id, token };
  } else {
    throw boom.unauthorized("Invalid password");
  }
}

async function create({ user_id, username, password }) {
  const data = {
    user_id,
    username,
    password: await encodePassword(password),
  };

  const auth = await store.create(data);

  return auth;
}

async function update({ user_id, username, password }) {
  const data = {};

  if (username) {
    data.username = username;
  }

  if (password) {
    data.password = await encodePassword(password);
  }

  const updatedAuth = await store.update(user_id, data);

  return updatedAuth;
}

async function deleteAuth(user_id) {
  const deletedAuth = await store.delete(user_id);
  return deletedAuth;
}

async function encodePassword(password) {
  return await bcrypt.hash(password, 5);
}

module.exports = {
  create,
  login,
  update,
  delete: deleteAuth,
};
