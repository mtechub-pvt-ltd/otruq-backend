const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const transactionHistorySchema = require("./transactionHistorySchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

////////// Create a transaction History ///////////
// localhost:4000/transaction/addTransactionHistory
router.route("/addTransactionHistory").post((request, response) => {
  let data = request.body;
  const transactionHistory = new transactionHistorySchema(data);
  transactionHistory
    .save()
    .then((result) => {
      response.status(200).json({
        message: "Transaction History added successfully",
        result,
      });
    })
    .catch((err) => {
      response.status(500).json({
        message: "Error while adding Transaction History",
        error: err,
      });
    });
});

/////// get specific driver transaction histories ////////
// localhost:4000/transaction/getDriverTransactionHistory/:id
router.route("/getDriverTransactionHistory/:id").get((request, response) => {
  let id = request.params.id;
  transactionHistorySchema
    .find({ driver: id })
    .populate("driver")
    .populate("order")
    .populate("merchant")
    .exec()
    .then((result) => {
      response.status(200).json({
        message: "Transaction History fetched successfully",
        result,
      });
    })
    .catch((err) => {
      response.status(500).json({
        message: "Error while fetching Transaction History",
        error: err,
      });
    });
});

module.exports = router;
