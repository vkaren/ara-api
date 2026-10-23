const boom = require("@hapi/boom");
const auth = require("../../api/auth");

function authenticate(ownerInfo) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(boom.unauthorized("Missing header authorization"));
      }

      const [scheme, token] = authHeader.split(" ");
      if (scheme !== "Bearer" || !token) {
        return next(boom.unauthorized("Invalid authorization format"));
      }

      const owner = req[ownerInfo.req][ownerInfo.prop];

      auth.check(token, String(owner));
      next();
    } catch (err) {
      next(boom.unauthorized(err.message));
    }
  };
}

module.exports = authenticate;
