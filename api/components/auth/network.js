const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { loginSchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");

router.post("/login", validatorHandler(loginSchema, "body"), login);

async function login(req, res, next) {
  try {
    const newLogin = await controller.login(req.body);
    res.status(200).json(newLogin);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
