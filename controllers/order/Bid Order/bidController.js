const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Bid = require("./bidSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/////////////// Create Bid //////////////
/* localhost:4000/order/createBid
{
    "recievingTime": "12:00",
    "shippingPrice": 200,
    "vehicleType": "car",
    "order": "5e9f8f8f8f8f8f8f8f8f8f8",
    "driver": "5e9f8f8f8f8f8f8f8f8f8f8f"
}
*/
router.route("/createBid").post((request, response) => {
  let data = request.body;
  let bidData = new Bid(data);
  bidData
    .save()
    .then((result) => {
      response.status(200).send({ message: "Bid Created", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in creating bid", err });
    });
});

router.route("/getBid").get((request, response) => {
  Bid.aggregate([
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
      response.status(200).send({ message: "Bids Fetched", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in fetching bids", err });
    });
});


module.exports = router;