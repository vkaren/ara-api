import type { NextFunction, Request, Response } from "express";

const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { followSchema, getFollowsSchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "body",
  prop: "follow_from",
};

router.get(
  "/followers/:user_id",
  validatorHandler(getFollowsSchema, "params"),
  getFollows
);
router.get(
  "/following/:user_id",
  validatorHandler(getFollowsSchema, "params"),
  getFollows
);
router.post(
  "/",
  validatorHandler(followSchema, "body"),
  authenticateHandler(authOwner),
  follow
);
router.delete(
  "/",
  validatorHandler(followSchema, "body"),
  authenticateHandler(authOwner),
  unfollow
);

async function getFollows(req: Request, res: Response, next: NextFunction) {
  try {
    const follows = await controller.getFollows({
      ...req.params,
      type: req.path.split("/")[1],
    });
    res.status(200).json(follows);
  } catch (err) {
    next(err);
  }
}

async function follow(req: Request, res: Response, next: NextFunction) {
  try {
    const follow = await controller.followUser(req.body);
    res.status(201).json(follow);
  } catch (err) {
    next(err);
  }
}

async function unfollow(req: Request, res: Response, next: NextFunction) {
  try {
    const unfollow = await controller.unfollowUser(req.body);
    res.status(202).json(unfollow);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
