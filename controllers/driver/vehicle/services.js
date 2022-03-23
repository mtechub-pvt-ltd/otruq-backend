const Vehicle = require("./vehicleSchema");

// Add Vehicle
async function createVehicle(vehicle) {
  return await vehicle
    .save()
    .then((result) => {
      return { message: "Vehicle Details saved", result };
    })
    .catch((err) => {
      return { message: "Error in saving data", statusCode: 400, err };
    });
}
async function saveVehicle(data) {
  let vehicleData = new Vehicle(data);
  var a = await createVehicle(vehicleData);
  return a;
}

// View Vehicle
async function viewVehicle() {
  const results = await Vehicle.find()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return { message: "Couldn't display data", statusCode: 400, error };
    });
  return results;
}

//View Specific vehicle
async function viewSpecificVehicle(reqID) {
  return await Vehicle.findById(reqID)
    .then((result) => {
      if (result) {
        return { message: "vehicle found", result };
      } else {
        return { message: "vehicle not found", statusCode: 400 };
      }
    })
    .catch((error) => {
      return { message: "Couldn't display data", statusCode: 400, error };
    });
}

// Update vehicle
async function modifyVehicle(vehicle, id) {
  return await Vehicle.updateOne({ _id: id }, { $set: vehicle })
    .then((result) => {
      return { message: "vehicle Profile Updated Successfully", result };
    })
    .catch((err) => {
      return {
        message: "Error in updating vehicle profile",
        statusCode: 400,
        err,
      };
    });
}
async function updateVehicle(vehicleData, id) {
  let res = await viewSpecificVehicle(id);
  if (res.statusCode == 400) {
    return res;
  } else {
    let a = await modifyVehicle(vehicleData, id);
    return a;
  }
}

// Delete vehicle
async function delVehicle(reqID) {
  return await Vehicle.findByIdAndDelete({ _id: reqID })
    .then((result) => {
      return { message: "vehicle profile Deleted Successfully", result };
    })
    .catch((err) => {
      return {
        message: "Error in deleting vehicle profile",
        statusCode: 400,
        err,
      };
    });
}
async function deleteVehicle(reqID) {
  let res = await viewSpecificVehicle(reqID);
  if (res.statusCode == 400) {
    return res;
  } else {
    var a = await delVehicle(reqID);
    return a;
  }
}

module.exports = {
  saveVehicle,
  viewVehicle,
  viewSpecificVehicle,
  updateVehicle,
  deleteVehicle,
};
