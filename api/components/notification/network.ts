import type { NextFunction, Request, Response } from "express";

const express = require("express");
const Joi = require("joi");
const router = express.Router();
const controller = require("./controller");
const { getUserNotificationsSchema, pagination } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "params",
  prop: "user_id",
};

router.get(
  "/:user_id",
  validatorHandler(getUserNotificationsSchema, "params"),
  validatorHandler(Joi.object(pagination), "query"),
  authenticateHandler(authOwner),
  getUserNotifications
);
router.patch(
  "/:user_id",
  validatorHandler(getUserNotificationsSchema, "params"),
  authenticateHandler(authOwner),
  updateUserNotifications
);

async function getUserNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notifications = await controller.getUserNotifications({ ...req.params, ...req.query });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
}

async function updateUserNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const notifications = await controller.updateSeenState(req.params);
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
