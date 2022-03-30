const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const profileService = require("./services");
const {
  upload,
  moveIMage,
  removeImage,
} = require("../../../middleware/multer");
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

///////////// Check phone number and Add Driver Profile//////////////
/*
  https://localhost:4000/driver/checkPhoneNo
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
        let driverData = new Driver(data);
        driverData
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
      Driver.findByIdAndUpdate(request.params.id, data, { new: true })
        .then((result) => {
          response
            .status(result.statusCode || 200)
            .json({ message: "Driver Profile Updated Successfully", result });
        })
        .catch((err) => {
          response
            .status(400)
            .json({ message: "Error in updating profile", err });
        });
    }
  });
});

///////////// Delete Driver Profile //////////////
// https://localhost:4000/driver/deleteDriver/62332afded01b903d423e024

router.route("/deleteDriver/:id").delete((request, response) => {
  Driver.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        if (result.profileImage) {
          console.log("result.profileImage", result.profileImage);
          removeImage(result.profileImage);
        }
        response
          .status(200)
          .json({ message: "Driver Deleted Successfully", result });
      } else {
        response.status(400).json({ message: "Driver not found" });
      }
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in deleting", err });
    });
});
module.exports = router;
