const Joi = require("joi");

const user_id = Joi.number().integer();

const getUserNotificationsSchema = Joi.object({
  user_id: user_id.required(),
});

module.exports = {
  getUserNotificationsSchema,
};
