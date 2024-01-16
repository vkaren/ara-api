const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { likeSchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "body",
  prop: "user_id",
};

router.post(
  "/",
  validatorHandler(likeSchema, "body"),
  authenticateHandler(authOwner),
  like
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

async function dislike(req, res, next) {
  try {
    const like = await controller.dislikePost(req.body);
    res.status(202).json(like);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
