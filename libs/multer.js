const multer = require("multer");
const {
  api: { host, port, filesRoute },
} = require("../config");

const upload = multer({
  dest: `public/${filesRoute}/`,
});

function getFileUrl(file) {
  return `${host}:${port}/${filesRoute}/${file}`;
}

module.exports = { upload, getFileUrl };
