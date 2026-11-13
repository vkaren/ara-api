import type { NextFunction, Request, Response } from "express";

const boom = require("@hapi/boom");

const attempts = new Map<string, { startedAt: number; count: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function loginRateLimit(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const key = req.ip;
  const current = attempts.get(key);

  if (!current || now - current.startedAt >= WINDOW_MS) {
    attempts.set(key, { startedAt: now, count: 1 });
    res.on("finish", () => {
      if (res.statusCode < 400) {
        attempts.delete(key);
      }
    });
    return next();
  }

  if (current.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - current.startedAt)) / 1000);
    res.set("Retry-After", String(retryAfter));
    return next(boom.tooManyRequests("Too many login attempts"));
  }

  current.count += 1;
  res.on("finish", () => {
    if (res.statusCode < 400) {
      attempts.delete(key);
    }
  });
  next();
}

module.exports = loginRateLimit;
