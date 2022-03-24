const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const trackOrderSchema = require("./trackOrderSchema");


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



module.routes = router;