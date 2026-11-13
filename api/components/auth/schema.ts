const Joi = require("joi");

const username = Joi.string();
const email = Joi.string().email().lowercase().trim();
const password = Joi.string();

const loginSchema = Joi.object({
  username: username.required(),
  password: password.required(),
});

const forgotPasswordSchema = Joi.object({
  email: email.required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().length(64).required(),
  password: password.min(8).required(),
});

module.exports = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
