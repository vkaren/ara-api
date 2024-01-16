const fs = require("fs");

function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

function removeFileOnAuthErrorHandler(err, req, res, next) {
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
  } catch (errRemoving) {
    console.log("[removeFileOnAuthErrorHandler]", errRemoving);
    next(err);
  }
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function errorHandler(err, req, res, next) {
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
