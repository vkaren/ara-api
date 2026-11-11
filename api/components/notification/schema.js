const Joi = require("joi");

const user_id = Joi.number().integer();
const pagination = {
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
};

const getUserNotificationsSchema = Joi.object({
  user_id: user_id.required(),
});

module.exports = {
  getUserNotificationsSchema,
  pagination,
};
