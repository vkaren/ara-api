const express = require("express");
const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const socket = require("../libs/socket");
const sequelize = require("../libs/sequelize");
const router = require("./router");
const {
  logErrors,
  removeFileOnAuthErrorHandler,
  errorHandler,
  boomErrorHandler,
} = require("./middlewares/error.handler");
const {
  api: { port },
  frontend,
} = require("../config");

app.use(
  cors({
    origin: frontend.url,
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "UPDATE", "OPTIONS"],
    allowedHeaders: [
      "X-Requested-With",
      "X-HTTP-Method-Override",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Authorization",
    ],
  })
);
app.use(express.json());

router(app);

app.use(logErrors);
app.use(removeFileOnAuthErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use(express.static("public"));

async function start() {
  try {
    await sequelize.authenticate();
    socket.connect(server);

    server.listen(port, () => {
      console.log(`Api listening on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database", error);
    process.exitCode = 1;
  }
}

start();
