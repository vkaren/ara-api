const { frontend } = require("../config");
const socketIO = require("socket.io");
const socket = {};

function connect(server) {
  socket.io = socketIO(server, { cors: { origin: frontend.url } });
}

module.exports = {
  connect,
  socket,
};
