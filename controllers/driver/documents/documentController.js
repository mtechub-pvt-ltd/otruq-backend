const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const {
  upload,
  moveIMage,
  removeImage,
} = require("../../../middleware/multer");
const Documents = require("./documentSchema");
const mongoose = require("mongoose");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.route("/addDriverDocuments").post((request, response) => {
  upload.any()(request, response, (err) => {
    if (err) {
      console.log(err);
      response.status(500).json({
        message: "Error in uploading image",
        error: err,
      });
    } else if (request.files.length == 4) {
      const uploadPath = "uploads/driver/documents/";
      request.files.forEach((element) => {
        moveIMage(element.path, uploadPath + element.filename);
      });
      let data = {
        idCardFront: uploadPath + request.files[0].filename,
        idCardBack: uploadPath + request.files[1].filename,
        driverLicense: uploadPath + request.files[2].filename,
        vehicleOwnership: uploadPath + request.files[3].filename,
        driver: request.body.driver,
      };
      let driverDocuments = new Documents(data);
      driverDocuments
        .save()
        .then((result) => {
          response.status(200).send({ message: "Documents saved", result });
        })
        .catch((err) => {
          response
            .status(400)
            .send({ message: "Error in saving data", err });
        });
    } else {
      request.files.forEach((element) => {
        removeImage(element.path);
      });
      response.status(400).send({ message: "Please upload all documents" });
    }
  });
});

router.route("/viewDriverDocuments/:id").get((request, response) => {
  Documents.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(request.params.id),
      },
    },
    {
      $lookup: {
        from: "driverprofiles",
        localField: "driver",
        foreignField: "_id",
        as: "driver",
      },
    },
  ])
    .then((result) => {
      if (result.length > 0) {
        response.status(200).send({ message: "Documents found", result });
      } else {
        response.status(400).send({ message: "Documents not found" });
      }
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

router.route("/viewDriverDocuments").get((request, response) => {
  Documents.aggregate([
    {
      $lookup: {
        from: "driverprofiles",
        localField: "driver",
        foreignField: "_id",
        as: "driver",
      },
    },
  ])
    .then((result) => {
      if (result) {
        response.status(200).send({ message: "Documents found", result });
      } else {
        response.status(400).send({ message: "Documents not found" });
      }
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

router.route("/updateDriverDocuments/:id").put((request, response) => {
  upload.any()(request, response, (err) => {
    if (err) {
      console.log(err);
      response.status(500).json({
        message: "Error in uploading image",
        error: err,
      });
    }
    const uploadPath = "uploads/driver/documents/";
    let data = {};
    request.files.forEach((element) => {
      moveIMage(element.path, uploadPath + element.filename);
      if (element.fieldname == "idCardFront") {
        data.idCardFront = uploadPath + element.filename;
      } else if (element.fieldname == "idCardBack") {
        data.idCardBack = uploadPath + element.filename;
      } else if (element.fieldname == "driverLicense") {
        data.driverLicense = uploadPath + element.filename;
      } else {
        data.vehicleOwnership = uploadPath + element.filename;
      }
    });
    Documents.findByIdAndUpdate(request.params.id, data)
      .then((result) => {
        // remove old images
        Object.keys(data).forEach((e) => {
          removeImage(result[e]);
        });
        response.status(200).send({ message: "Documents updated", result });
      })
      .catch((err) => {
        // remove uploaded images if error
        request.files.forEach((element) => {
          removeImage(uploadPath + element.filename);
        });
        response.status(400).send({ message: "Error in updating data", err });
      });
  });
});

router.route("/deleteDriverDocuments/:id").delete((request, response) => {
  Documents.findByIdAndDelete(request.params.id)
    .then((result) => {
      removeImage(result.idCardFront);
      removeImage(result.idCardBack);
      removeImage(result.driverLicense);
      removeImage(result.vehicleOwnership);
      response.status(200).send({ message: "Documents deleted", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in deleting data", err });
    });
});

module.exports = router;
