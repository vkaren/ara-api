require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  database: {
    uri: process.env.DATABASE_URL,
    development: {
      username: process.env.DB_DEV_USERNAME,
      password: process.env.DB_DEV_PASSWORD,
      database: process.env.DB_DEV_NAME,
      host: process.env.DB_DEV_HOST,
      port: process.env.DB_DEV_PORT,
    },
  },
  api: {
    url: process.env.API_URL,
    port: process.env.PORT,
    publicRoute: process.env.PUBLIC_ROUTE,
    filesRoute: process.env.FILES_ROUTE,
  },
  jwt: {
    secret: process.env.SECRET,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
};

module.exports = config;
