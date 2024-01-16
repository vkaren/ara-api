const { Sequelize } = require("sequelize");
const config = require("../config");
const setupModels = require("../db/models");

const URI = encodeURI(config.database.uri);

const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  logging: false,
});

setupModels(sequelize);

sequelize.sync();

module.exports = sequelize;
