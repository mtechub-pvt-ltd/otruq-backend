const Driver = require("./profileSchema");
const {removeImage} = require("../../../middleware/multer");
// Add Driver
async function createDriver(driver) {
  return await driver
    .save()
    .then((result) => {
      return { message: "Driver profile saved", result };
    })
    .catch((err) => {
      return { message: "Error in saving data", statusCode: 400, err };
    });
}
async function saveDriver(data) {
  let DriverData = new Driver(data);
  var a = await createDriver(DriverData);
  return a;
}

// View specific Driver
async function viewSpecificDriver(reqID) {
  return await Driver.findById(reqID)
    .then((result) => {
      if (result) {
        return { message: "Driver found", result };
      } else {
        return { message: "Driver not found", statusCode: 400 };
      }
    })
    .catch((error) => {
      return { message: "Couldn't display data", statusCode: 400, error };
    });
}

// View all Drivers
async function viewData() {
  return await Driver.find()
    .then((result2) => {
      return result2;
    })
    .catch((error) => {
      return { message: "Couldn't display data", statusCode: 400, error };
    });
}
async function viewDrivers() {
  const results = await viewData()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });
  return results;
}

// Update Driver
async function modifyDriver(driver, id) {
  return await Driver.updateOne({ _id: id }, { $set: driver },{new:true})
    .then((result) => {
      return { message: "Driver Updated Successfully", result };
    })
    .catch((err) => {
      return {
        message: "Error in updating driver profile",
        statusCode: 400,
        err,
      };
    });
}
async function updateDriver(DriverData, id) {
  let res = await viewSpecificDriver(id);
  if (res.statusCode == 400) {
    return res;
  } else {
    var a = await modifyDriver(DriverData, id);
    if (a.statusCode === 400) {
      removeImage(DriverData.profileImage);
    } else if(DriverData.profileImage && DriverData.profileImage != res.result.profileImage) {
        removeImage(res.result.profileImage);
      }
    return a;
  }
}

// Delete Driver
async function delDriver(reqID) {
  return await Driver.findByIdAndDelete({ _id: reqID })
    .then((result) => {
      return { message: "Driver Deleted Successfully", result };
    })
    .catch((err) => {
      return {
        message: "Error in deleting driver profile",
        statusCode: 400,
        err,
      };
    });
}
async function deleteDriver(reqID) {
  let res = await viewSpecificDriver(reqID);
  if (res.statusCode == 400) {
    return res;
  } else {
    var a = await delDriver(reqID);
    if (a.statusCode != 400) {
      removeImage(a.result.profileImage);
    }
    return a;
  }
}

module.exports = {
  saveDriver,
  viewDrivers,
  viewSpecificDriver,
  updateDriver,
  deleteDriver,
};
