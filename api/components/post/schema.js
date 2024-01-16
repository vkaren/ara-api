const Joi = require("joi");

const id = Joi.number().integer();
const content = Joi.string();

const postSchema = Joi.object({
  author_id: id.required(),
  content: content.required(),
});

const getPostSchema = Joi.object({
  id: id.required(),
});

const getUserPostsSchema = Joi.object({
  author_id: id,
});

const deletePostSchema = Joi.object({
  author_id: id.required(),
  post_id: id.required(),
});

module.exports = {
  postSchema,
  getPostSchema,
  getUserPostsSchema,
  deletePostSchema,
};
