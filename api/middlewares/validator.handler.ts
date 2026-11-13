import type { NextFunction, Request, Response } from "express";
import type Joi from "joi";

const boom = require("@hapi/boom");

type RequestProperty = "body" | "params" | "query";

function validatorHandler(schema: Joi.AnySchema, property: RequestProperty) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      return next(boom.badRequest(error));
    }
    next();
  };
}

module.exports = validatorHandler;
