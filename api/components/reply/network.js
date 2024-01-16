const express = require("express");
const router = express.Router();
const { upload } = require("../../../libs/multer");
const controller = require("./controller");
const { replySchema, deleteReplySchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "body",
  prop: "author_id",
};

router.post(
  "/",
  upload.single("inserted_image"),
  validatorHandler(replySchema, "body"),
  authenticateHandler(authOwner),
  createReply
);
router.delete(
  "/",
  validatorHandler(deleteReplySchema, "body"),
  authenticateHandler(authOwner),
  deleteReply
);

async function createReply(req, res, next) {
  try {
    const reply = await controller.createReply({
      ...req.body,
      inserted_image: req.file?.filename || null,
    });
    res.status(201).json(reply);
  } catch (err) {
    next(err);
  }
}

async function deleteReply(req, res, next) {
  try {
    const reply = await controller.deleteReply(req.body);
    res.status(202).json(reply);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
