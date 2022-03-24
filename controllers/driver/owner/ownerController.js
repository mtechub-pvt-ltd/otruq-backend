const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const ownerSchema = require("./ownerSchema");
const mongoose = require("mongoose");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

////////// Create an owner //////////
/* localhost:4000/driver/owner/addOwner
{
    "name": "Rajesh",
    "familyName": "Kumar",
    "whatsappNo": "9888888888",
    "gender":"male",
    "address":"india",
    "driver":"623938e99c3fda36bdbf041a"
}
*/
router.route("/addOwner").post((request, response) => {
  let owner = new ownerSchema(request.body);
  owner
    .save()
    .then((result) => {
      response.status(200).send({ message: "Owner saved", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in saving data", err });
    });
});

////////// View all owners //////////
router.route("/viewOwner").get((request, response) => {
  ownerSchema
    .aggregate([
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
        response.status(200).send({ message: "Owners found", result });
      } else {
        response.status(400).send({ message: "Owners not found" });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in finding data", err });
    });
});

////////// View owner by id //////////
router.route("/viewOwner/:id").get((request, response) => {
  ownerSchema
    .aggregate([
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
        response.status(200).send({ message: "Owner found", result });
      } else {
        response.status(400).send({ message: "Owner not found" });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in finding data", err });
    });
});

///////// Update owner by id //////////
/* localhost:4000/driver/owner/updateOwner/id
{
    "name": "Rajesh",
    "familyName": "Kumar",
    "whatsappNo": "9888888888",
    "gender":"male",
    "address":"india",
    "driver":"623938e99c3fda36bdbf041a"
}
*/
router.route("/updateOwner/:id").put((request, response) => {
  ownerSchema
    .findByIdAndUpdate(request.params.id, request.body)
    .then((result) => {
      if (result) {
        response.status(200).send({ message: "Owner updated", result });
      } else {
        response.status(400).send({ message: "Owner not found" });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in updating data", err });
    });
});

///////// Delete owner by id //////////
// localhost:4000/driver/owner/deleteOwner/id

router.route("/deleteOwner/:id").delete((request, response) => {
  ownerSchema
    .findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).send({ message: "Owner deleted", result });
      } else {
        response.status(400).send({ message: "Owner not found" });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in deleting data", err });
    });
});

module.exports = router;
