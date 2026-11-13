import type { NextFunction, Request, Response } from "express";

const boom = require("@hapi/boom");
const auth = require("../../api/auth");

type OwnerInfo = {
  req: "body" | "params";
  prop: string;
};

function authenticate(ownerInfo: OwnerInfo) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(boom.unauthorized("Missing header authorization"));
      }

      const [scheme, token] = authHeader.split(" ");
      if (scheme !== "Bearer" || !token) {
        return next(boom.unauthorized("Invalid authorization format"));
      }

      const source = req[ownerInfo.req] as Record<string, string | number>;
      const owner = source[ownerInfo.prop];

      auth.check(token, String(owner));
      next();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid token";
      next(boom.unauthorized(message));
    }
  };
}

module.exports = authenticate;
