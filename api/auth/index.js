const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");
const {
  jwt: { secret },
} = require("../../config");

function sign(data) {
  const signData = jwt.sign(data, secret);
  return signData;
}

function check(token, owner) {
  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded) {
      throw boom.unauthorized("Invalid token");
    }

    if (decoded.id !== owner) {
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
