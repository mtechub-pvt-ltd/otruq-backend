const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const orderStatsSchema = require("./orderStatsSchema");
const mongoose = require("mongoose");
const acceptRejectOrder = require("../acceptReject/acceptRejectSchema");
const trackOrderSchema = require("../trackOrder/trackOrderSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Get orders of a specific driver from acceptReject collection and then return rejected orders
async function getDriverAcceptReject(driverId) {
  let drivers = await acceptRejectOrder
    .aggregate([
      {
        $match: {
          driver: mongoose.Types.ObjectId(driverId),
        },
      },
    ])
    .then((result) => {
      if (result.length > 0) {
        return result;
      } else {
        response.status(400).send({ message: "Order not found" });
      }
    })
    .catch((err) => {
      response.status(500).json(err);
    });
  let rejectedOrders = drivers.filter((item, index) => {
    if (item.status == "pending") {
      return item;
    }
  });
  return rejectedOrders.length;
}
// Get orders of a specific driver from trackOrder collection and return delivered and total orders
async function getDeliveredOrders(id) {
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
    ])
    .then((result) => {
      return result;
    })
    .catch((err) => {
      response.status(400).json({ message: "Order Not found", err });
    });
  let totalOrders = drivers.length;
  let deliveredOrders = drivers.filter((item) => {
    if (item.order[0].status == "delivered") {
      return item;
    }
  });
  let data = {
    totalOrders,
    deliveredOrders: deliveredOrders.length,
  };
  return data;
}
router.route("/calDriverOrderStats").post(async (request, response) => {
  let id = request.body.driver;
  let rejectedOrders = await getDriverAcceptReject(id)
    .then((rejectedOrders) => {
      return rejectedOrders;
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in calculating", err });
    });
  let res = await getDeliveredOrders(id)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in calculating", err });
    });
  let data = {
    totalOrders: res.totalOrders,
    OrderDelivered: res.deliveredOrders,
    orderRejection: rejectedOrders,
    driver: id,
  };
  let OrderStatsData = new orderStatsSchema(data);
  OrderStatsData.save()
    .then((result) => {
      response
        .status(200)
        .json({ message: "Stats Calculated and stored successfully", result });
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in calculating", err });
    });
});

///// get all stats of a driver //////
router.route("/getDriverOrderStats/:id").get(async (request, response) => {
  let id = request.params.id;
  let result = await orderStatsSchema
    .aggregate([
      {
        $match: {
          driver: mongoose.Types.ObjectId(id),
        },
      },
    ])
    .then((result) => {
      return result;
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in calculating", err });
    });
  response.status(200).json({ message: "Stats calculated", result });
});

module.exports = router;
