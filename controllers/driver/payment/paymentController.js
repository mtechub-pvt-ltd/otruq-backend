const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Payment = require("./paymentSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

///////////// Add Payment Details//////////////
/*
  https://localhost:4000/payment/addPayment
  {
    "bankName": "askari",
    "accountNumber": "1234567",
    "accountHolderName":"Moiz-Ur-Rehman",
    "expiryDate": 2014,
    "CVV":8765
    }
*/
router.route("/addPayment").post((request, response) => {
  let data = request.body;
  let paymentData = new Payment(data);
  paymentData
    .save()
    .then((result) => {
      response.status(200).send({ message: "Payment Details saved", result });
    })
    .catch((err) => {
      response
        .status(400)
        .send({ message: "Error in saving data", statusCode: 400, err });
    });
});

/////////////// View Specific Payment Details//////////////
// https://localhost:4000/payment/viewPayment/id

router.route("/viewPayment/:id").get((request, response) => {
  let id = request.params.id;
  Payment.findById(id).then((result) => {
    if (result) {
      response.status(200).send({ message: "Payment Details found", result });
    } else {
      response.status(400).send({ message: "Payment Details not found" });
    }
  });
});

////////////////// View all vehicles //////////////////
// https://localhost:4000/payment/viewPayment

router.route("/viewPayment").get((request, response) => {
  Payment.find().then((result) => {
    if (result) {
      response.status(200).send({ message: "Payment Details found", result });
    } else {
      response.status(400).send({ message: "Payment Details not found" });
    }
  });
});

///////////// Update Payment Details //////////////
/*
  https://localhost:4000/payment/updatePayment/62346dfccfe651f822e160a8
   {
    "bankName": "askari",
    "accountNumber": "1234567",
    "accountHolderName":"Moiz-Ur-Rehman",
    "expiryDate": 2014,
    "CVV":8765
    }
*/

router.route("/updatePayment/:id").put((request, response) => {
  let id = request.params.id;
  let data = request.body;
  Payment.findByIdAndUpdate(id, data).then((result) => {
    if (result) {
      response.status(200).send({ message: "Payment Details updated", result });
    } else {
      response.status(400).send({ message: "Payment Details not found" });
    }
  });
});

///////////// Delete Payment Details //////////////
// https://localhost:4000/payment/deletePayment/62332afded01b903d423e024

router.route("/deletePayment/:id").delete((request, response) => {
  let id = request.params.id;
  Payment.findByIdAndRemove(id).then((result) => {
    if (result) {
      response.status(200).send({ message: "Payment Details deleted", result });
    } else {
      response.status(400).send({ message: "Payment Details not found" });
    }
  });
});
module.exports = router;
