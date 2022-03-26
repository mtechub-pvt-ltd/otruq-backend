const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Order = require("./orderSchema");
const mongoose = require("mongoose");
const {
  upload,
  moveIMage,
  removeImage,
} = require("../../../middleware/multer");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/////////////// Create Order //////////////
/* localhost:4000/order/createOrder
{
    "service": "delivery",
    "vehicleType": "car",
    "pickupLocation": "kigali",
    "dropoffLocation": "kicukiro",
    "shippingPrice": 200,
    "recievingTime": "12:00",
    "senderWhatsapp": "078989898",
    "recieverWhatsapp": "078989898",
    "driverNotes": "good",
    "payRecieve": "pay",
    "senderReciepient": "sender",
}
*/
router.route("/createOrder").post((request, response) => {
  let data = request.body;
  let orderData = new Order(data);
  orderData
    .save()
    .then((result) => {
      response.status(200).send({ message: "Order Created", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in creating order", err });
    });
});

/////////// Get specific order //////////////
// localhost:4000/order/getOrder/id

router.route("/getOrder/:id").get((request, response) => {
  let id = request.params.id;
  Order.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
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
        response.status(200).send({ message: "Order found", result });
      } else {
        response.status(400).send({ message: "Order not found", result });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in getting order", err });
    });
});

//////////// Get Specific Merchants All Orders //////////////
// localhost:4000/order/getMerchantOrders/id
router.route("/getMerchantOrders/:id").get((request, response) => {
  let id = request.params.id;
  Order.find({ merchant: id })
    .then((result) => {
      if (result.length > 0) {
        response.status(200).send({ message: "Order found", result });
      } else {
        response.status(400).send({ message: "Order not found", result });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in getting order", err });
    });
});

//////////// Get all orders //////////////
// localhost:4000/order/getOrder

router.route("/getOrder").get((request, response) => {
  Order.aggregate([
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
        response.status(200).send({ message: "Orders Fetched", result });
      } else {
        response.status(200).send({ message: "No orders found", result });
      }
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in fetching orders", err });
    });
});

////////////// update order //////////////
/* localhost:4000/order/updateOrder/id
{
  "status":"completed"
}
*/
router.route("/updateOrder/:id").put((request, response) => {
  upload.any()(request, response, (err) => {
    if (err) {
      console.log(err);
      response.status(500).json({
        message: "Error in uploading image",
        error: err,
      });
    }
    const uploadPath = "uploads/order/createOrder/";
    let data = {
      orderImages: [],
    };
    request.files.forEach((element, index) => {
      moveIMage(element.path, uploadPath + element.filename);
      data.orderImages[index] = uploadPath + element.filename;
    });
    Order.findByIdAndUpdate(request.params.id, data)
      .then((result) => {
        if (result) {
          response.status(200).send({ message: "Order Updated", result });
        } else {
          request.files.forEach((element) => {
            removeImage(uploadPath + element.filename);
          });
          response.status(400).send({ message: "Order not found", result });
        }
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

///////////// delete order //////////////
// localhost:4000/order/deleteOrder/id
router.route("/deleteOrder/:id").delete((request, response) => {
  let id = request.params.id;
  Order.findByIdAndDelete(id)
    .then((result) => {
      response.status(200).send({ message: "Order deleted", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in deleting order", err });
    });
});

// calculate order radius
function calcCrow(lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return (Value * Math.PI) / 180;
}

router.route("/getOrderByRadius").post(async (request, response) => {
  let data = request.body;
  let driverLat = data.driverLat;
  let driverLng = data.driverLng;
  // getting those orders which are pending
  let pendingOrders = await Order.find({
    status: "pending",
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      response
        .status(400)
        .send({ message: "Error in calculating radius", err });
    });
  // getting those orders which are in radius
  let orders = pendingOrders.filter((order) => {
    let orderLat = order.pickupLocation.lat;
    let orderLng = order.pickupLocation.lng;
    let distance = calcCrow(driverLat, driverLng, orderLat, orderLng).toFixed(
      1
    );
    if (distance <= 5) {
      return order;
    }
  });
  if (orders.length > 0) {
    response.status(200).send({ message: "Orders found", orders });
  } else {
    response.status(400).send({ message: "No orders found", orders });
  }
});
module.exports = router;
