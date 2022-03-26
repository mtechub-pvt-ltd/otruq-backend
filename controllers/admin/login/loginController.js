const express = require("express");
const signupSchema = require("../signup/signupSchema");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//////////////////////////  LOGIN    ////////////////////////////
/*  http://localhost:4000/admin/login    
{
    "email": "admin@gmail.com",
    "password": "123"
}   
*/

router.route("/login").post((request, response) => {
  let data = { ...request.body };
  if (!(data.email && data.password)) {
    response.status(400).json({ message: "All inputs are required" });
  } else {
    signupSchema.findOne({ email: data.email }).then((admin) => {
      if (admin.length < 1) {
        return response.status(404).json({
          message: "admin not found",
        });
      } else {
        bcrypt
          .compare(data.password, user[0][0].password)
          .then((match) => {
            if (match) {
              response.status(200).json({
                message: "Login Successful",
              });
            } else {
              response.status(401).json({
                message: "Incorrect Password",
              });
            }
          })
          .catch((err) => {
            response.status(500).json({
              error: err,
            });
          });
      }
    });
  }
});

////////////////////////// LOGOUT ///////////////////////////
//  http://localhost:5000/admin/logout

router.route("/logout").get((request, response) => {
  response.clearCookie("access_token");
  response.status(200).json({
    message: "Logout Successful",
  });
});

module.exports = router;
