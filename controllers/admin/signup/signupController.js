const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const SignupSchema = require("./signupSchema");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

///////////////////////////   REGISTER    ////////////////////////////
/*  http://localhost:4000/admin/signup    
    {
        "firstName": "John",
        "lastName": "Doe",
        "email": "
        "jobTitle": "admin",
        "gender":"male",
        "password": "12344",
        "confirmPassword":"12344"
    }
*/

router.route("/signup").post((request, response) => {
  let data = { ...request.body };
  if (
    !(
      data.email &&
      data.password &&
      data.confirmPassword &&
      data.firstName &&
      data.lastName
    )
  ) {
    response.status(400).json({ message: "All inputs are required" });
  } else if (data.password !== data.confirmPassword) {
    response
      .status(400)
      .json({ message: "Password and Confirm Password do not match" });
  } else {
    bcrypt.hash(data.password, 10, (err, hash) => {
      if (err) {
        return response.status(500).json({
          error: err,
        });
      } else {
        data.password = hash;
        const signupData = new SignupSchema(data);
        signupData.save()
          .then((data) => {
            response.status(201).json({
              message:
                "Congratulations! Your account has been successfully created.",
            });
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

module.exports = router;
