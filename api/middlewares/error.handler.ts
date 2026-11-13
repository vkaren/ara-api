import type { NextFunction, Request, Response } from "express";

const fs = require("fs");

type AppError = Error & {
  code?: string;
  isBoom?: boolean;
  output?: {
    statusCode: number;
    payload: Record<string, unknown>;
  };
};

function logErrors(err: unknown, _req: Request, _res: Response, next: NextFunction) {
  console.error(err);
  next(err);
}

function removeFileOnAuthErrorHandler(
  err: unknown,
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const uploadedFile = req.file?.path;

    if (uploadedFile) {
      if (fs.existsSync(uploadedFile)) {
        fs.unlinkSync(uploadedFile);

        console.log("[removeFileOnAuthErrorHandler] File deleted successfully");
      } else {
        console.log("[removeFileOnAuthErrorHandler] File does not exist");
      }
    }

    next(err);
    } catch (errRemoving: unknown) {
    console.log("[removeFileOnAuthErrorHandler]", errRemoving);
    next(err);
  }
}

function boomErrorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      statusCode: 413,
      error: "Payload Too Large",
      message: "Image must be smaller than 5 MB",
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request",
      message: "Only one file can be uploaded",
    });
  }

  if (err.isBoom) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function errorHandler(
  _err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  return res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = {
  logErrors,
  removeFileOnAuthErrorHandler,
  errorHandler,
  boomErrorHandler,
};
