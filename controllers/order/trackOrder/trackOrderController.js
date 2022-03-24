const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const trackOrderSchema = require("./trackOrderSchema");


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.route("/trackOrder").post((request, response) => {
    let data = { ...request.body };
    trackOrderSchema
        .save(data)
        .then((result) => {
            response.status(200).json(result);
        })
        .catch((err) => {
            response.status(400).json(err);
        });
});


module.exports = router;