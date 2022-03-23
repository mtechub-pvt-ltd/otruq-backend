const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const acceptRejectOrder = require("./acceptRejectSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/////////////// accept/reject //////////////
/* localhost:4000/order/acceptReject
{
    "status": "accept",
    "order": "5e9f8f8f8f8f8f8f8f8f8f8",
    "driver": "5e9f8f8f8f8f8f8f8f8f8f8f",
    "merchant": "5e9f8f8f8f8f8f8f8f8f8f8f"
}
*/
router.route("/acceptReject").post((request, response) => {
  let data = request.body;
  let acceptRejectData = new acceptRejectOrder(data);
  acceptRejectData
    .save()
    .then((result) => {
      response.status(200).send({ message: "Order Accepted", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in accepting order", err });
    });
});

/////////////// get all accepted rejected orders //////////////
// localhost:4000/order/getAcceptReject

router.route("/getAcceptReject").get((request, response) => {
  acceptRejectOrder
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
      response.status(200).send({ message: "Orders Fetched", result });
    })
    .catch((err) => {
      response.status(400).send({ message: "Error in fetching orders", err });
    });
});

module.exports = router;