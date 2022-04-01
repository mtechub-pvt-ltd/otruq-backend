const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const coupon = require("./couponSchema");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

///////// add coupon ////////////
/*
localhost:4000/admin/addCoupon
{
    "name": "Oturq1year",
    "discount": "10",
    "expiryDate": "2022-04-01T12:48:00.000Z",
    "admin" : "012345678901234567890123",
} 
*/
router.route("/addCoupon").post((req, res) => {
  const newCoupon = new coupon(req.body);
  newCoupon
    .save()
    .then((result) =>
      res.status(200).json({ message: "Coupon added!", result })
    )
    .catch((err) =>
      res.status(400).json({ message: "Error in creating coupon", err })
    );
});

//////// get all coupons /////////
// localhost:4000/admin/getAllCoupons
router.route("/getAllCoupons").get((req, res) => {
  coupon
    .find()
    .then((coupons) => {
      if (coupons.length > 0) {
        res.status(200).json({ message: "Coupons found", coupons });
      } else {
        res.status(400).json({ message: "No coupons found" });
      }
    })
    .catch((err) =>
      res.status(400).json({ message: "Error in fetching coupons", err })
    );
});

/// get Valid coupons ////////
// localhost:4000/admin/getValidCoupons
router.route("/getValidCoupons").get((req, res) => {
  coupon
    .find({ expiryDate: { $gte: new Date() } })
    .then((coupons) => {
      if (coupons.length > 0) {
        res.status(200).json({ message: "Coupons found", coupons });
      } else {
        res.status(400).json({ message: "No coupons found" });
      }
    })
    .catch((err) =>
      res.status(400).json({ message: "Error in fetching coupons", err })
    );
});

///////// update coupon /////////
// localhost:4000/admin/updateCoupon/id
router.route("/updateCoupon/:id").put((req, res) => {
  coupon
    .findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Coupon updated!", result });
      } else {
        res.status(400).json({ message: "Error in updating", err });
      }
    })
    .catch((err) => res.status(400).json({ message: "Error", err }));
});

///////// delete coupon /////////
// localhost:4000/admin/deleteCoupon/id
router.route("/deleteCoupon/:id").delete((req, res) => {
  coupon
    .findOneAndDelete({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Coupon deleted!", result });
      } else {
        res.status(400).json({ message: "Error in deleting", err });
      }
    })
    .catch((err) => res.status(400).json({ message: "Error", err }));
});

module.exports = router;
