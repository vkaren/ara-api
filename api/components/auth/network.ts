import type { NextFunction, Request, Response } from "express";

const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { loginSchema } = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const loginRateLimit = require("../../middlewares/rate-limit.handler");

router.post(
  "/login",
  loginRateLimit,
  validatorHandler(loginSchema, "body"),
  login
);

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const newLogin = await controller.login(req.body);
    res.status(200).json(newLogin);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
