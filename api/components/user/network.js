const express = require("express");
const router = express.Router();
const { upload } = require("../../../libs/multer");
const controller = require("./controller");
const { getUserSchema, userSchema, updateUserSchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const authenticateHandler = require("../../middlewares/auth.handler");

const authOwner = {
  req: "params",
  prop: "id",
};

router.get("/", getListUsers);
router.get("/:id", validatorHandler(getUserSchema, "params"), getUser);
router.post(
  "/",
  upload.single("profile_photo"),
  validatorHandler(userSchema, "body"),
  createUser
);
router.patch(
  "/:id",
  validatorHandler(getUserSchema, "params"),
  authenticateHandler(authOwner),
  upload.single("profile_photo"),
  validatorHandler(updateUserSchema, "body"),
  updateUser
);
router.delete(
  "/:id",
  validatorHandler(getUserSchema, "params"),
  authenticateHandler(authOwner),
  deleteUser
);

async function getListUsers(req, res, next) {
  try {
    const users = await controller.listUsers(req.query);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await controller.getUser(req.params);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const newUser = await controller.createUser({
      ...req.body,
      profile_photo: req.file?.filename || null,
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await controller.updateUser({
      ...req.body,
      id: req.params.id,
      profile_photo: req.file?.filename || null,
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userDeleted = await controller.deleteUser(req.params);
    res.status(202).json(userDeleted);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
