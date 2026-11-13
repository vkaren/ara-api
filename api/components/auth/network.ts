import type { NextFunction, Request, Response } from "express";

const express = require("express");
const router = express.Router();
const controller = require("./controller");
const {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} = require("./schema");
const validatorHandler = require("../../middlewares/validator.handler");
const loginRateLimit = require("../../middlewares/rate-limit.handler");
const passwordResetRateLimit = loginRateLimit.passwordResetRateLimit;

router.post(
  "/login",
  loginRateLimit,
  validatorHandler(loginSchema, "body"),
  login,
);
router.post(
  "/forgot-password",
  passwordResetRateLimit,
  validatorHandler(forgotPasswordSchema, "body"),
  forgotPassword,
);
router.post(
  "/reset-password",
  validatorHandler(resetPasswordSchema, "body"),
  resetPassword,
);

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const newLogin = await controller.login(req.body);
    res.status(200).json(newLogin);
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await controller.requestPasswordReset(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await controller.resetPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = router;
