const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const connectionDB = require("./database/db");
require('dotenv').config()
const port = process.env.PORT || 4000;

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Controllers
const driverProfileController = require("./controllers/driver/profile/profileController");
const merchantProfileController = require("./controllers/merchant/profile/profileController");
const vehicleController = require("./controllers/driver/vehicle/vehicleController");
const paymentController = require("./controllers/driver/payment/paymentController");
const driverDocumentsController = require("./controllers/driver/documents/documentController");
const orderController = require("./controllers/order/orderCRUD/orderController");
const bidController = require("./controllers/order/Bid Order/bidController");
const acceptRejectController = require("./controllers/order/acceptReject/acceptRejectController");
const cancelOrder = require("./controllers/order/cancelOrder/cancelController");
const orderScreenShotController = require("./controllers/order/orderSS/orderSSController");
const ownerController = require("./controllers/driver/owner/ownerController");

//Routes
app.use("/driver", driverProfileController,driverDocumentsController,);
app.use("/merchant", merchantProfileController);
app.use("/vehicle", vehicleController);
app.use("/payment", paymentController);
app.use('/order', orderController,bidController,acceptRejectController,cancelOrder,orderScreenShotController);
app.use("/driver/owner", ownerController);

app.listen(port, () => {
    console.log(`Server is running Fine on port ${port}`);
});
app.get("/", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).send("Server is running Fine on port " + port);
});