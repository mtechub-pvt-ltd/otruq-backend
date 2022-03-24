const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const orderSSSchema = require("./orderSSSchema");
const mongoose = require("mongoose");
const {
  upload,
  moveIMage,
  removeImage,
} = require("../../../middleware/multer");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/////////// upload order screen shot //////////////
// localhost:4000/order/uploadSS
router.route("/uploadSS").post((request, response) => {
  upload.single("orderSS")(request, response, (err) => {
    if (err) {
      console.log(err);
      response.status(500).json({
        message: "Error in uploading image",
        error: err,
      });
    } else {
      let data = { ...request.body };
      if (request.file) {
        moveIMage(
          request.file.path,
          "uploads/order/screenshot/" + request.file.filename
        );
        data.orderSS = "uploads/order/screenshot/" + request.file.filename;
      }
      let orderSS = new orderSSSchema(data);
      orderSS
        .save()
        .then((result) => {
          response.status(200).json({
            message: "Image uploaded successfully",
            data: result,
          });
        })
        .catch((err) => {
          removeImage("uploads/order/screenshot/" + request.file.filename);
          response.status(500).json({
            message: "Error in uploading image",
            error: err,
          });
        });
    }
  });
});

module.exports = router;
