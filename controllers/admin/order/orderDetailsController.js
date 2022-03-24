const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const orderDetailsSchema = require("./orderDetailsSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

////// Add order Details////////
router.route("/addOrderDetails").post((request, response) => {
  let data = { ...request.body };
  let OrderDetailsData = new orderDetailsSchema(data);
  OrderDetailsData.save()
    .then((result) => {
      response
        .status(200)
        .json({ message: "Order Details Added Succesfully", result });
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in adding data" }, err);
    });
});

////// get all Order Details /////
router.route("/getOrderDetails").get((request, response) => {
  orderDetailsSchema
    .find()
    .then((result) => {
      if (result.length > 0) {
        response.status(200).json({ message: "Data found", result });
      } else {
        response.status(400).json({ message: "Data not found", result });
      }
    })
    .catch((err) => {
      response.status(400).json({ message: "Error in displaying data", err });
    });
});

//////////// delete order Details/////////////
// localhost:4000/admin/deleteOrderDetails/id
router.route("/deleteOrderDetails/:id").delete((request, response) => {
  orderDetailsSchema
    .findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(200).json({ message: "Deleted successfully", result });
      } else {
        response.status(400).json({ message: "Order Detail not found", result });
      }
    })
    .catch((err) => {
      response.status(400).json({ message: "error in deleting", err });
    });
});

module.exports = router;
