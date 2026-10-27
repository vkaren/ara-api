const { models } = require("../../../libs/sequelize");

async function createAuth(data, options = {}) {
  const newAuth = await models.Auth.create(data, options);
  return newAuth;
}

async function getAuth(param, options = {}) {
  const query = {};

  if (isNaN(param - "")) {
    query.where = { username: param };
  } else {
    query.where = { user_id: param };
  }
  const auth = await models.Auth.findOne({ ...query, ...options });

  return auth;
}

async function updateAuth(user_id, newData, options = {}) {
  const authToUpdate = await getAuth(user_id, options);
  const updatedAuth = await authToUpdate.update({
    ...newData,
  }, options);

  return updatedAuth;
}

async function deleteAuth(user_id, options = {}) {
  const authDeleted = await models.Auth.destroy({
    where: { user_id },
    ...options,
  });

  return authDeleted;
}

module.exports = {
  create: createAuth,
  get: getAuth,
  update: updateAuth,
  delete: deleteAuth,
};
