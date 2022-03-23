const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const profileService = require("./services");
const { upload, moveIMage } = require("../../../middleware/multer");
const Driver = require("./profileSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

///////////// Add Driver Profile//////////////
/*
  https://localhost:4000/driver/addDriver
  {
    "firsName": "Rajesh",
    "email": "testing123@gmail.com",
    "lastName": "Raj",
    "homeAddress": "kolkata, India"
  }
*/
router.route("/addDriver").post((request, response) => {
  let data = request.body;
  profileService
    .saveDriver(data)
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});

/////////////// View Specific Driver Profile//////////////
// https://localhost:4000/driver/viewDriver/id

router.route("/viewDriver/:id").get((request, response) => {
  let id = request.params.id;
  profileService.viewSpecificDriver(id).then((result) => {
    response.status(result.statusCode || 200).json(result);
  });
});

////////////////// View Drivers //////////////////
// https://localhost:4000/driver/viewDriver

router.route("/viewDriver").get((request, response) => {
  profileService
    .viewDrivers()
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});

///////////// Update Driver Profile //////////////
/*
  https://localhost:4000/driver/updateDriver/62332afded01b903d423e024
  {
    "firsName": "moiz",
    "email": "testing123@gmail.com",
    "lastName": "malik",
    "homeAddress": "rawal dam, Islamabad."
  }
*/

router.route("/updateDriver/:id").put((request, response) => {
  upload.single("profileImage")(request, response, (err) => {
    if (err) {
      console.log(err);
      response.status(500).json({
        message: "Error in uploading image",
        error: err,
      });
    } else {
      let data = request.body;
      if (request.file) {
        moveIMage(
          request.file.path,
          "uploads/driver/profile/" + request.file.filename
        );
        data.profileImage = "uploads/driver/profile/" + request.file.filename;
      }
      Driver.findByIdAndUpdate(request.params.id, data)
        .then((result) => {
          response.status(result.statusCode || 200).json(result);
        })
        .catch((err) => {
          response.status(400).json(err);
        });
    }
  });
});

///////////// Delete Driver Profile //////////////
// https://localhost:4000/driver/deleteDriver/62332afded01b903d423e024

router.route("/deleteDriver/:id").delete((request, response) => {
  profileService
    .deleteDriver(request.params.id)
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});
module.exports = router;
