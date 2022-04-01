const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const announcement = require("./announcementSchema");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

////// add announcement ////////////
/*
localhost:4000/admin/addAnnouncement
{
    "message": "This is a test announcement",
    "date": "2020-05-05",
    "admin" : "012345678901234567890123",
}
 */
router.route("/addAnnouncement").post((req, res) => {
  const newAnnouncement = new announcement(req.body);
  newAnnouncement
    .save()
    .then((result) =>
      res.status(200).json({ message: "Announcement added!", result })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

/////// get all announcements /////////
// localhost:4000/admin/getAllAnnouncements
router.route("/getAllAnnouncements").get((req, res) => {
  announcement
    .find()
    .then((announcements) => {
      if (announcements.length > 0) {
        res.status(200).json({ message: "Data found", announcements });
      } else {
        res.status(400).json({ message: "No Data found" });
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

///// update announcement ////////
// localhost:4000/admin/updateAnnouncement/id
router.route("/updateAnnouncement/:id").put((req, res) => {
  announcement
    .findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Announcement updated!", result });
      } else {
        res.status(400).json({ message: "Error in updating", err });
      }
    })
    .catch((err) => res.status(400).json({ message: "Error: ", err }));
});

///// delete announcements ////////
// localhost:4000/admin/deleteAnnouncement/id
router.route("/deleteAnnouncement/:id").delete((req, res) => {
  announcement
    .findOneAndDelete({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.status(200).json({ message: "Announcement deleted!", result });
      } else {
        res.status(400).json({ message: "Error in deleting", err });
      }
    })
    .catch((err) => res.status(400).json({ message: "Error: ", err }));
});

////// Display announcement by expiry date ///////
// localhost:4000/admin/getValidAnnouncements
router.route("/getValidAnnouncements").get((req, res) => {
  announcement
    .find({ expiryDate: { $gt: new Date() } })
    .then((announcements) => {
      if (announcements.length > 0) {
        res.status(200).json({ message: "Announcements found", announcements });
      } else {
        res.status(400).json({ message: "No Announcements found" });
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
