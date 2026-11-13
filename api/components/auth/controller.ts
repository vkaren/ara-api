import type {
  AuthInput,
  AuthRecord,
  ForgotPasswordInput,
  LoginInput,
  RequestOptions,
  ResetPasswordInput,
  UpdateAuthInput,
} from "../../types";
import type { Transaction } from "sequelize";
import {
  createPasswordResetToken,
  hashPasswordResetToken,
} from "../../utils/password-reset";

const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");
const auth = require("../../auth");
const sequelize = require("../../../libs/sequelize");
const userStore = require("../user/store");
const mailer = require("../../../libs/mailer");
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
  options: RequestOptions = {},
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
  options: RequestOptions = {},
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

async function requestPasswordReset({
  email,
}: ForgotPasswordInput): Promise<{ message: string }> {
  const message =
    "If an account exists for this email, a password reset email has been sent.";
  const user = await userStore.getByEmail(email);

  if (!user) {
    return { message };
  }

  const authRecord = await store.get(user.id);

  if (!authRecord) {
    return { message };
  }

  const { token, tokenHash, expiresAt } = createPasswordResetToken();

  await store.setResetToken(authRecord.user_id, tokenHash, expiresAt);
  try {
    await mailer.sendPasswordResetEmail({ to: email, token });
  } catch (error) {
    console.error("Unable to send password reset email", error);
  }

  return { message };
}

async function resetPassword({
  token,
  password,
}: ResetPasswordInput): Promise<{ message: string }> {
  const authRecord = await store.getByResetTokenHash(
    hashPasswordResetToken(token),
  );

  if (
    !authRecord ||
    !authRecord.password_reset_expires_at ||
    authRecord.password_reset_expires_at.getTime() <= Date.now()
  ) {
    throw boom.unauthorized("Invalid or expired password reset token");
  }

  await sequelize.transaction(async (transaction: Transaction) => {
    await update({ user_id: authRecord.user_id, password }, { transaction });
    await store.clearResetToken(authRecord.user_id, { transaction });
  });

  return { message: "Password has been reset successfully" };
}

async function encodePassword(password: string) {
  return await bcrypt.hash(password, bcryptRounds);
}

module.exports = {
  create,
  login,
  update,
  delete: deleteAuth,
  requestPasswordReset,
  resetPassword,
};
