const Joi = require("joi");

const id = Joi.number().integer();

const followSchema = Joi.object({
  follow_from: id.required(),
  follow_to: id.required(),
});

const getFollowsSchema = Joi.object({
  user_id: id.required(),
});

module.exports = {
  followSchema,
  getFollowsSchema,
};
