const user = require("../components/user/network");
const follow = require("../components/follow/network");
const notification = require("../components/notification/network");
const post = require("../components/post/network");
const reply = require("../components/reply/network");
const like = require("../components/like/network");
const auth = require("../components/auth/network");

const routes = function (server) {
  server.use("/auth", auth);
  server.use("/user", user);
  server.use("/follow", follow);
  server.use("/notification", notification);
  server.use("/post", post);
  server.use("/reply", reply);
  server.use("/like", like);
};

module.exports = routes;
