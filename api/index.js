const express = require("express");
const cors = require("cors");

const app = express();
const server = require("http").Server(app);
const socket = require("../libs/socket");
const router = require("./router");
const {
  logErrors,
  removeFileOnAuthErrorHandler,
  errorHandler,
  boomErrorHandler,
} = require("./middlewares/error.handler");
const {
  api: { port },
} = require("../config");

app.use(cors());
app.use(express.json());

router(app);

app.use(logErrors);
app.use(removeFileOnAuthErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.use(express.static("public"));

socket.connect(server);

server.listen(port, () => {
  console.log(`Api listening on port ${port}`);
});
