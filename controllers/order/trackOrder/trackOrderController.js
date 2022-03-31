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
      if (result) {
        response.status(200).json({ message: "found", result });
      } else {
        response.status(400).json({ message: "not found" });
      }
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in fetching", err });
    });
});

////////////////////// Get Specific Drivers Orders //////////////////////
// https://localhost:4000/order/getDriverOrders/driverID
router.route("/getDriverOrders/:id").get((request, response) => {
  let id = request.params.id;
  getSpecificDriverOrders(id)
    .then((result) => {
      if (result.length > 0) {
        response.status(200).json({ message: "Orders found", result });
      } else {
        response.status(400).json({ message: "Orders not found", result });
      }
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in searching orders", err });
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
      if (result) {
        response.status(200).json({ message: "Updated succesfully", result });
      } else {
        response.status(400).json({ message: "Could not update", result });
      }
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in updating", err });
    });
});

// Get orders of a specific driver
async function getSpecificDriverOrders(id) {
  let drivers = await trackOrderSchema
    .aggregate([
      {
        $match: {
          driver: mongoose.Types.ObjectId(id),
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
      {
        $unwind: "$order",
      },
      {
        $project: {
          _id: 1,
          shipmentStarted: 1,
          receiptArrived: 1,
          shipmentRecieved: 1,
          shipmentDelivered: 1,
          "order._id": 1,
          "order.status": 1,
          "order.vehicleType": 1,
          "order.pickupLocation.address": 1,
          "order.dropoffLocation.address": 1,
          "order.shippingPrice": 1,
          "order.recievingTime": 1,
          "order.driverNotes": 1,
          "order.merchant": 1,
          "order.OrderId": 1,
        },
      },
    ])
    .then((result) => {
      return result;
    })
    .catch((err) => {
      response.status(400).json({ message: "Order Not found", err });
    });
  return drivers;
}

///////////// Get Specific Orders track order //////////////
// localhost:4000/order/getSpecificOrderTracking/orderID
router.route("/getSpecificOrderTracking/:id").get((request, response) => {
  let id = request.params.id;
  trackOrderSchema
    .aggregate([
      {
        $match: {
          order: mongoose.Types.ObjectId(id),
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
        $unwind: "$driver",
      }
    ])
    .then((result) => {
      response.status(200).json({ message: "found", result });
    })
    .catch((err) => {
      response.status(400).json({ message: "Not found", err });
    });
});

module.exports = router;
