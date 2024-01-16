const express = require("express");
const router = express.Router();
const { upload } = require("../../../libs/multer");
const controller = require("./controller");
const {
  postSchema,
  getPostSchema,
  getUserPostsSchema,
  deletePostSchema,
} = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "body",
  prop: "author_id",
};

router.get("/", validatorHandler(getUserPostsSchema, "query"), getListPosts);
router.get("/:id", validatorHandler(getPostSchema, "params"), getPost);
router.post(
  "/",
  upload.single("inserted_image"),
  validatorHandler(postSchema, "body"),
  authenticateHandler(authOwner),
  createPost
);
router.delete(
  "/",
  validatorHandler(deletePostSchema, "body"),
  authenticateHandler(authOwner),
  deletePost
);

async function getListPosts(req, res, next) {
  try {
    const posts = await controller.listPosts(req.query);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const post = await controller.getPost(req.params);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
}

async function createPost(req, res, next) {
  try {
    const post = await controller.createPost({
      ...req.body,
      inserted_image: req.file?.filename || null,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const postDeleted = await controller.deletePost(req.body);
    res.status(202).json(postDeleted);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
