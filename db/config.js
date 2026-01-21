const {
  database: { development },
} = require("../config");

module.exports = {
  development: {
    username: development.username,
    password: development.password,
    database: development.database,
    host: development.host,
    port: development.port,
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
