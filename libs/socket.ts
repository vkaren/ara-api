import type { Server as SocketServer } from "socket.io";
import type { Server as HttpServer } from "http";

const { frontend } = require("../config");
const socketIO = require("socket.io");
const socket: { io?: SocketServer } = {};

function connect(server: HttpServer): void {
  socket.io = socketIO(server, { cors: { origin: frontend.url } });
}

module.exports = {
  connect,
  socket,
};
