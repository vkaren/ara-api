const jsonwebtoken = require("jsonwebtoken");
const boom = require("@hapi/boom");
const {
  jwt: { secret },
  jwt: jwtConfig,
} = require("../../config");

function sign(data) {
  const signData = jsonwebtoken.sign(data, secret, {
    expiresIn: jwtConfig.expiresIn,
    issuer: jwtConfig.issuer,
  });
  return signData;
}

function check(token, owner) {
  try {
    const decoded = jsonwebtoken.verify(token, secret, {
      issuer: jwtConfig.issuer,
    });

    if (!decoded) {
      throw boom.unauthorized("Invalid token");
    }

    if (String(decoded.id) !== String(owner)) {
      throw boom.unauthorized("Invalid id");
    }

    return true;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  sign,
  check,
};
