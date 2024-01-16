require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  database: {
    uri:
      process.env.DATABASE_URL || "postgres://postgres:5432@localhost/postgres",
  },
  api: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || "http://localhost",
    publicRoute: process.env.PUBLIC_ROUTE || "/app",
    filesRoute: process.env.FILES_ROUTE || "files",
  },
  jwt: {
    secret: process.env.SECRET || "secret",
  },
};

module.exports = config;
