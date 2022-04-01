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
        "email": "john@gmail.com""
        "jobTitle": "admin",
        "gender":"male",
        "dob": "19/19/1999"
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
      data.lastName &&
      data.dob &&
      data.role
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
        signupData
          .save()
          .then((data) => {
            response.status(201).json({
              message:
                "Congratulations! Your account has been successfully created.",
              data,
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

//////////// Delete User //////////////
//  http://localhost:4000/admin/deleteUser/id
router.route("/deleteUser/:id").delete((request, response) => {
  SignupSchema.findOneAndDelete({ _id: request.params.id })
    .then((data) => {
      if (data) {
        response.status(200).json({
          message: "User deleted successfully",
          data,
        });
      } else {
        response.status(404).json({
          message: "User not found",
        });
      }
    })
    .catch((err) => {
      response.status(500).json({
        message: "Error deleting user",
        error: err,
      });
    });
});

////////// Update User //////////////
//  http://localhost:4000/admin/updateUser/id
router.route("/updateUser/:id").put((request, response) => {
  SignupSchema.findOneAndUpdate({ _id: request.params.id }, request.body, {
    new: true,
  })
    .then((data) => {
      response.status(200).json({
        message: "User updated successfully",
        data,
      });
    })
    .catch((err) => {
      response.status(500).json({
        message: "Error updating user",
        error: err,
      });
    });
});

////////// Get all Users //////////////
//  http://localhost:4000/admin/getAllUsers
router.route("/getAllUsers").get((request, response) => {
  SignupSchema.find()
    .then((data) => {
      if (data.length > 0) {
        response.status(200).json({
          message: "All users",
          data,
        });
      } else {
        response.status(200).json({
          message: "No users found",
        });
      }
    })
    .catch((err) => {
      response.status(500).json({
        message: "Error in fetching all users",
        error: err,
      });
    });
});

module.exports = router;
