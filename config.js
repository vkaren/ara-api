require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  database: {
    uri:
      process.env.DATABASE_URL || "postgres://postgres:5432@localhost/postgres",
  },
  api: {
    url: process.env.API_URL || "http://localhost:3000",
    port: process.env.PORT || 3000,
    publicRoute: process.env.PUBLIC_ROUTE || "/app",
    filesRoute: process.env.FILES_ROUTE || "files",
  },
  jwt: {
    secret: process.env.SECRET || "secret",
  },
  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:8080",
  },
};

module.exports = config;
