const Joi = require("joi");

const id = Joi.number().integer();
const nickname = Joi.string();
const username = Joi.string();
const password = Joi.string();
const bio = Joi.string();

const userSchema = Joi.object({
  nickname: nickname.required(),
  username: username.required(),
  password: password.required(),
  bio,
});

const updateUserSchema = Joi.object({
  nickname: nickname.allow(""),
  username: username.allow(""),
  password: password.allow(""),
  bio: bio.allow(""),
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  userSchema,
  updateUserSchema,
  getUserSchema,
};
