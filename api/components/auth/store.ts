import type {
  AuthInput,
  AuthLookupQuery,
  PasswordResetRecord,
  RequestOptions,
  UpdateAuthInput,
} from "../../types";

const { models } = require("../../../libs/sequelize");

async function createAuth(data: AuthInput, options: RequestOptions = {}) {
  const newAuth = await models.Auth.create(data, options);
  return newAuth;
}

async function getAuth(param: number | string, options: RequestOptions = {}) {
  let query: AuthLookupQuery;

  if (isNaN(Number(param))) {
    query = { where: { username: String(param) } };
  } else {
    query = { where: { user_id: Number(param) } };
  }
  const auth = await models.Auth.findOne({ ...query, ...options });

  return auth;
}

async function updateAuth(
  user_id: number,
  newData: Omit<UpdateAuthInput, "user_id">,
  options: RequestOptions = {}
) {
  const authToUpdate = await getAuth(user_id, options);
  const updatedAuth = await authToUpdate.update({
    ...newData,
  }, options);

  return updatedAuth;
}

async function deleteAuth(user_id: number, options: RequestOptions = {}) {
  const authDeleted = await models.Auth.destroy({
    where: { user_id },
    ...options,
  });

  return authDeleted;
}

async function getByResetTokenHash(
  password_reset_token_hash: string
): Promise<PasswordResetRecord | null> {
  return models.Auth.findOne({
    where: { password_reset_token_hash },
  });
}

async function setResetToken(
  user_id: number,
  password_reset_token_hash: string,
  password_reset_expires_at: Date,
  options: RequestOptions = {}
) {
  const auth = await getAuth(user_id, options);
  return auth.update(
    { password_reset_token_hash, password_reset_expires_at },
    options
  );
}

async function clearResetToken(user_id: number, options: RequestOptions = {}) {
  const auth = await getAuth(user_id, options);
  return auth.update(
    {
      password_reset_token_hash: null,
      password_reset_expires_at: null,
    },
    options
  );
}

module.exports = {
  create: createAuth,
  get: getAuth,
  update: updateAuth,
  delete: deleteAuth,
  getByResetTokenHash,
  setResetToken,
  clearResetToken,
};
