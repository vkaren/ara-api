const Joi = require("joi");

const id = Joi.number().integer();
const content = Joi.string();

const replySchema = Joi.object({
  author_id: id.required(),
  replying_to_post: id.required(),
  replying_to_user: id.required(),
  content: content.required(),
});

const deleteReplySchema = Joi.object({
  author_id: id.required(),
  reply_id: id.required(),
});

module.exports = {
  replySchema,
  deleteReplySchema,
};
