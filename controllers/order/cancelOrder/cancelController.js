const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const cancelOrder = require("./cancelSchema");
const mongoose = require("mongoose");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/////////////// cancel Order //////////////
/* localhost:4000/order/cancelOrder
{
    "status": "cancel",
    "reason": "payment problem",
    "order": "5e9f8f8f8f8f8f8f8f8f8f8",
    "driver": "5e9f8f8f8f8f8f8f8f8f8f8f",
    "merchant": "5e9f8f8f8f8f8f8f8f8f8f8f"
}
*/
router.route("/cancelOrder").post((request, response) => {
  let data = request.body;
  let cancelData = new cancelOrder(data);
  cancelData
    .save()
    .then((result) => {
      if (result.status == "cancel") {
        response.status(200).send({ message: "Order Cancelled", result });
      } else {
        response.status(200).send({ message: "Order not cancelled", result });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in cancelling order", err });
    });
});

/////////////// get all cancelled orders //////////////
// localhost:4000/order/getCancelOrders

router.route("/getCancelOrder").get((request, response) => {
  cancelOrder
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
      {
        $lookup: {
          from: "merchantprofiles",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant",
        },
      },
    ])
    .then((result) => {
      if (result.length > 0) {
        response
          .status(200)
          .send({ message: "Cancelled Orders Fetched", result });
      } else {
        response
          .status(200)
          .send({ message: "No cancelled orders found", result });
      }
    })
    .catch((err) => {
      response
        .status(400)
        .send({ message: "Error in fetching cancelled orders", err });
    });
});

/////////////// get specific cancelled order //////////////
// localhost:4000/order/getCancelOrder/id
router.route("/getCancelOrder/:id").get((request, response) => {
  cancelOrder
    .aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(request.params.id),
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
        $lookup: {
          from: "driverprofiles",
          localField: "driver",
          foreignField: "_id",
          as: "driver",
        },
      },
      {
        $lookup: {
          from: "merchantprofiles",
          localField: "merchant",
          foreignField: "_id",
          as: "merchant",
        },
      },
    ])
    .then((result) => {
      if (result.length > 0) {
        response.status(200).send({ message: "Order Fetched", result });
      } else {
        response.status(400).send({ message: "Order not found" });
      }
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

module.exports = router;
