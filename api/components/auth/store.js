const { models } = require("../../../libs/sequelize");

async function createAuth(data) {
  const newAuth = await models.Auth.create(data);
  return newAuth;
}

async function getAuth(param) {
  const query = {};

  if (isNaN(param - "")) {
    query.where = { username: param };
  } else {
    query.where = { user_id: param };
  }
  const auth = await models.Auth.findOne(query);

  return auth;
}

async function updateAuth(user_id, newData) {
  const authToUpdate = await getAuth(user_id);
  const updatedAuth = await authToUpdate.update({
    ...newData,
  });

  return updatedAuth;
}

async function deleteAuth(user_id) {
  const authDeleted = await models.Auth.destroy({
    where: { user_id },
  });

  return authDeleted;
}

module.exports = {
  create: createAuth,
  get: getAuth,
  update: updateAuth,
  delete: deleteAuth,
};
