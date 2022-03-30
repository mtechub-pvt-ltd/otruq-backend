const mongoose = require("mongoose");
const connectionDB = mongoose
  .connect("mongodb+srv://root:toor@cluster0.qygvi.mongodb.net/Oturq?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("Connection is succesfull with the database");
  })
  .catch((err) => {
    console.log("Error in connecting database",err);
  });

module.exports = connectionDB;