const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { getUserNotificationsSchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "params",
  prop: "user_id",
};

router.get(
  "/:user_id",
  validatorHandler(getUserNotificationsSchema, "params"),
  authenticateHandler(authOwner),
  getUserNotifications
);
router.patch(
  "/:user_id",
  validatorHandler(getUserNotificationsSchema, "params"),
  authenticateHandler(authOwner),
  updateUserNotifications
);

async function getUserNotifications(req, res, next) {
  try {
    const notifications = await controller.getUserNotifications(req.params);
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
}

async function updateUserNotifications(req, res, next) {
  try {
    const notifications = await controller.updateSeenState(req.params);
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
