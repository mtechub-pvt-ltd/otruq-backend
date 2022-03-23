const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const vehicleService = require("./services");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

///////////// Add Vehicle Profile//////////////
/*
  https://localhost:4000/vehicle/addVehicle
  {
    "vehicleType": "van",
    "plateNumber": "bg-851",
    "plateCode":"851",
    "yearOfManufacture": 2014,
    "companyOfManufacture":"Suzuki",
    "vehicleColor":"Grey"
}
*/
router.route("/addVehicle").post((request, response) => {
  let data = request.body;
  vehicleService
    .saveVehicle(data)
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

/////////////// View Specific Vehicle Profile//////////////
// https://localhost:4000/vehicle/viewVehicle/id

router.route("/viewVehicle/:id").get((request, response) => {
  let id = request.params.id;
  vehicleService
    .viewSpecificVehicle(id)
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

////////////////// View all vehicles //////////////////
// https://localhost:4000/vehicle/viewVehicle

router.route("/viewVehicle").get((request, response) => {
  vehicleService
    .viewVehicle()
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});

///////////// Update Vehicle Profile //////////////
/*
  https://localhost:4000/vehicle/updateVehicle/62346dfccfe651f822e160a8
  {
    "vehicleType": "Van",
    "plateNumber": "BG-851",
    "plateCode":"851",
    "yearOfManufacture": 2014,
    "companyOfManufacture":"Suzuki Pakistan",
    "vehicleColor":"Graphite Grey"
}
*/

router.route("/updateVehicle/:id").put((request, response) => {
  vehicleService
    .updateVehicle(request.body, request.params.id)
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});

///////////// Delete Vehicle Details //////////////
// https://localhost:4000/vehicle/deleteVehicle/62332afded01b903d423e024

router.route("/deleteVehicle/:id").delete((request, response) => {
  vehicleService
    .deleteVehicle(request.params.id)
    .then((result) => {
      response.status(result.statusCode || 200).json(result);
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});
module.exports = router;
