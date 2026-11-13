import type {
  AuthInput,
  AuthRecord,
  LoginInput,
  RequestOptions,
  UpdateAuthInput,
} from "../../types";

const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const auth = require("../../auth");
const {
  security: { bcryptRounds },
} = require("../../../config");
const store = require("./store");

async function login({ username, password }: LoginInput) {
  const user = await store.get(username);

  if (!user) {
    throw boom.unauthorized("Invalid credentials");
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
    throw boom.unauthorized("Invalid credentials");
  }
}

async function create(
  { user_id, username, password }: AuthInput,
  options: RequestOptions = {}
) {
  const data = {
    user_id,
    username,
    password: await encodePassword(password),
  };

  const auth = await store.create(data, options);

  return auth;
}

async function update(
  { user_id, username, password }: UpdateAuthInput,
  options: RequestOptions = {}
) {
  const data: Partial<Pick<AuthRecord, "username" | "password">> = {};

  if (username) {
    data.username = username;
  }

  if (password) {
    data.password = await encodePassword(password);
  }

  const updatedAuth = await store.update(user_id, data, options);

  return updatedAuth;
}

async function deleteAuth(user_id: number, options: RequestOptions = {}) {
  const deletedAuth = await store.delete(user_id, options);
  return deletedAuth;
}

async function encodePassword(password: string) {
  return await bcrypt.hash(password, bcryptRounds);
}

module.exports = {
  create,
  login,
  update,
  delete: deleteAuth,
};
