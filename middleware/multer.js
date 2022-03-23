const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const moveIMage = (source, destination) => {
  fs.rename(source, destination, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
const removeImage = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = { upload, moveIMage, removeImage };
