const Joi = require("joi");

const id = Joi.number().integer();
const type = ["post", "reply"];

const likeSchema = Joi.object({
  user_id: id.required(),
  message_id: id.required(),
  type,
});

module.exports = {
  likeSchema,
};
