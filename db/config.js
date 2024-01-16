const {
  database: { uri },
} = require("../config");

module.exports = {
  development: {
    url: uri,
    dialect: "postgres",
  },
  production: {
    url: uri,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
