const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Order = require("./orderSchema");

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
    "status": "pending"
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
      response
        .status(400)
        .send({ message: "Error in creating order", err });
    });
});

/////////// Get specific order //////////////
// localhost:4000/order/getOrder/id

router.route("/getOrder/:id").get((request, response) => {
    let id = request.params.id;
    Order.findById(id)
        .then((result) => {
            response.status(200).send({ message: "Order found", result });
        })
        .catch((err) => {
            response.status(400).send({ message: "Error in finding order", err });
        });
});

//////////// Get all orders //////////////
// localhost:4000/order/getOrder

router.route("/getOrder").get((request, response) => {
    Order.find()
        .then((result) => {
            response.status(200).send({ message: "All orders found", result });
        })
        .catch((err) => {
            response.status(400).send({ message: "Error in finding all orders", err });
        });
});

////////////// update order //////////////
// localhost:4000/order/updateOrder/id

router.route("/updateOrder/:id").put((request, response) => {
    let id = request.params.id;
    let data = request.body;
    Order.findByIdAndUpdate(id, data, { new: true })
        .then((result) => {
            response.status(200).send({ message: "Order updated", result });
        })
        .catch((err) => {
            response.status(400).send({ message: "Error in updating order", err });
        });
});


module.exports = router;
