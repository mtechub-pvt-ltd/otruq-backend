const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const profileService = require("./services");
const {
  upload,
  moveIMage,
  removeImage,
} = require("../../../middleware/multer");
const Merchant = require("./profileSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

///////////// Add Merchant Profile//////////////
/*
  https://localhost:4000/merchant/checkPhoneNo
  {
    "phoneNumber": "03435995776"
  }
*/

router.route("/checkPhoneNo").post((request, response) => {
  let data = { ...request.body };
  profileService
    .checkPhoneNo(data)
    .then((result) => {
      if (result.statusCode === 400) {
        let merchantData = new Merchant(data);
        merchantData
          .save()
          .then((result) => {
            response.status(200).send({ message: "data added", result });
          })
          .catch((err) => {
            response.status(400).send({ message: "Error in adding data", err });
          });
      } else {
        response.status(200).json(result);
      }
    })
    .catch((err) => {
      response.status(500).json({
        message: "Error in checking phone number",
        error: err,
      });
    });
});

/////////////// View Specific Merchant Profile//////////////
// https://localhost:4000/merchant/viewMerchant/id

router.route("/viewMerchant/:id").get((request, response) => {
  let id = request.params.id;
  profileService.viewSpecificMerchant(id).then((result) => {
    response.status(result.statusCode || 200).json(result);
  });
});

////////////////// View Merchants //////////////////
// https://localhost:4000/merchant/viewMerchant

router.route("/viewMerchant").get((request, response) => {
  profileService
    .viewMerchant()
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});

///////////// Update Merchant Profile //////////////
/*
  https://localhost:4000/merchant/updateMerchant/62332afded01b903d423e024
  {
    "firstName": "moiz",
    "email": "testing123@gmail.com",
    "lastName": "malik",
    "homeAddress": "rawal dam, Islamabad."
  }
*/

router.route("/updateMerchant/:id").put((request, response) => {
  upload.single("profileImage")(request, response, (err) => {
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
          "uploads/merchant/" + request.file.filename
        );
        data.profileImage = "uploads/merchant/" + request.file.filename;
      }
      Merchant.findByIdAndUpdate(request.params.id, data)
        .then((result) => {
          response.status(200).json({ message: "Data updated", result });
        })
        .catch((err) => {
          removeImage("uploads/merchant/" + request.file.filename);
          response.status(400).json({ message: "Error in updating", err });
        });
    }
  });
});

///////////// Delete Merchant Profile //////////////
// https://localhost:4000/merchant/deleteMerchant/62332afded01b903d423e024

router.route("/deleteMerchant/:id").delete((request, response) => {
  profileService
    .deleteMerchant(request.params.id)
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});
module.exports = router;
