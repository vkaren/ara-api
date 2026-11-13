const Joi = require("joi");

const id = Joi.number().integer();
const nickname = Joi.string();
const username = Joi.string();
const email = Joi.string().email().lowercase().trim();
const password = Joi.string();
const bio = Joi.string();

const userSchema = Joi.object({
  nickname: nickname.required(),
  username: username.required(),
  email: email.required(),
  password: password.required(),
  bio,
});

const updateUserSchema = Joi.object({
  nickname: nickname.allow(""),
  username: username.allow(""),
  email: email.allow(""),
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
