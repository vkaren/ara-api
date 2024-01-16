const boom = require("@hapi/boom");
const auth = require("../../api/auth");

function authenticate(ownerInfo) {
  return (req, res, next) => {
    try {
      let authHeader = req.headers.authorization;

      if (!authHeader) {
        next(boom.unauthorized("Missing header authorization"));
      }
      if (!authHeader.includes("Bearer")) {
        next(boom.unauthorized("Invalid format"));
      }

      let token = authHeader.split(" ")[1];

      if (!token) {
        next(boom.unauthorized("Missing token"));
      }

      let owner = req[ownerInfo.req][ownerInfo.prop] - "";

      auth.check(token, owner);
      next();
    } catch (err) {
      next(boom.unauthorized(err.message));
    }
  };
}

module.exports = authenticate;
