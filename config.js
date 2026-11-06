require("dotenv").config();

const bcryptRounds = Number.parseInt(process.env.BCRYPT_ROUNDS || "12", 10);

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
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    issuer: process.env.JWT_ISSUER || "ara-api",
  },
  security: {
    bcryptRounds,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
};

function validateRuntimeConfig() {
  const required = [
    ["DATABASE_URL", config.database.uri],
    ["API_URL", config.api.url],
    ["FRONTEND_URL", config.frontend.url],
    ["FILES_ROUTE", config.api.filesRoute],
    ["SECRET", config.jwt.secret],
  ];
  const missing = required
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (config.jwt.secret.length < 32) {
    throw new Error("SECRET must contain at least 32 characters");
  }

  if (!Number.isInteger(bcryptRounds) || bcryptRounds < 10 || bcryptRounds > 15) {
    throw new Error("BCRYPT_ROUNDS must be an integer between 10 and 15");
  }
}

module.exports = { ...config, validateRuntimeConfig };
