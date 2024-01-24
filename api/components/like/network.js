const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { likeSchema, getLikesSchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "body",
  prop: "user_id",
};

const authOwnerGet = {
  req: "params",
  prop: "id",
};

router.post(
  "/",
  validatorHandler(likeSchema, "body"),
  authenticateHandler(authOwner),
  like
);
router.get(
  "/:id",
  validatorHandler(getLikesSchema, "params"),
  authenticateHandler(authOwnerGet),
  getLikes
);
router.delete(
  "/",
  validatorHandler(likeSchema, "body"),
  authenticateHandler(authOwner),
  dislike
);

async function like(req, res, next) {
  try {
    const like = await controller.likePost(req.body);
    res.status(201).json(like);
  } catch (err) {
    next(err);
  }
}

async function getLikes(req, res, next) {
  try {
    const likes = await controller.getLikes(req.params);
    res.status(200).json(likes);
  } catch (err) {
    next(err);
  }
}

async function dislike(req, res, next) {
  try {
    const like = await controller.dislikePost(req.body);
    res.status(202).json(like);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
