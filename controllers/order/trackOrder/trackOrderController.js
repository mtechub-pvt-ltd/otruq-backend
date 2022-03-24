const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const trackOrderSchema = require("./trackOrderSchema");
const mongoose = require("mongoose");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.route("/trackOrder").post((request, response) => {
  let data = { ...request.body };
  let trackOrderData = new trackOrderSchema(data);
  trackOrderData
    .save()
    .then((result) => {
      response.status(200).json({ message: "tracking started", result });
    })
    .catch((err) => {
      response.status(400).json(err);
    });
});
/////// get specific track orders ///////
// https://localhost:4000/order/getTrackOrder/id
router.route("/getTrackOrder/:id").get((request, response) => {
  let id = request.params.id;
  trackOrderSchema
    .aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
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
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "order",
        },
      },
    ])
    .then((result) => {
      response.status(200).json({ message: "found", result });
    })
    .catch((err) => {
      response.status(400).json({ message: "Not found", err });
    });
});

///////////////////// Get All Track Order //////////////////////
// localhost:4000/order/trackOrder/getTrackOrders
router.route("/gettrackOrders").get((request, response) => {
  trackOrderSchema
    .aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "order",
          foreignField: "_id",
          as: "order",
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
      response.status(200).json({ message: "data found", result });
    })
    .catch((err) => {
      response.status(400).json({ message: "Data not found", err });
    });
});

////// update track order //////
// localhost:4000/order/updateTrackOrder/id
router.route("/updateTrackOrder/:id").put((request, response) => {
  let id = request.params.id;
  let data = { ...request.body };
  trackOrderSchema
    .findByIdAndUpdate(id, data, { new: true })
    .then((result) => {
      response.status(200).json({ message: "Updated succesfully", result });
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in updating", err });
    });
});

module.exports = router;
