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
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(boom.badRequest("Only image files are allowed"));
    }

    callback(null, true);
  },
});

function getFileUrl(file) {
  return `${url}/${filesRoute}/${file}`;
}

module.exports = { upload, getFileUrl };
