import type { Request } from "express";
import type { FileFilterCallback } from "multer";

const multer = require("multer");
const boom = require("@hapi/boom");
const {
  api: { url, filesRoute },
} = require("../config");

const upload = multer({
  dest: `public/${filesRoute}/`,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(boom.badRequest("Only image files are allowed"));
    }

    callback(null, true);
  },
});

function getFileUrl(file: string): string {
  return `${url}/${filesRoute}/${file}`;
}

module.exports = { upload, getFileUrl };
