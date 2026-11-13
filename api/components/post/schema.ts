const Joi = require("joi");

const id = Joi.number().integer();
const content = Joi.string();
const pagination = {
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
};

const postSchema = Joi.object({
  author_id: id.required(),
  content: content.required(),
});

const getPostSchema = Joi.object({
  id: id.required(),
});

const getUserPostsSchema = Joi.object({
  author_id: id,
  ...pagination,
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
