const Merchant = require("./profileSchema");
const { removeImage } = require("../../../middleware/multer");


// Check phone number
async function checkPhoneNo(data) {
  return await Merchant.findOne({ phoneNumber: data.phoneNumber })
    .then((result) => {
      if (result) {
        return { message: "Phone number already exists", result };
      } else {
        return { message: "Phone number not found", statusCode: 400, result };
      }
    })
    .catch((err) => {
      return {
        message: "Error in checking phone number",
        statusCode: 400,
        err,
      };
    });
}

// View all Merchants
async function viewData() {
  return await Merchant.find()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      return { message: "Couldn't display data", statusCode: 400, error };
    });
}
async function viewMerchant() {
  const results = await viewData()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return err;
    });

  return results;
}

//View Specific Merchant
async function viewSpecificMerchant(reqID) {
  return await Merchant.findById(reqID)
    .then((result) => {
      if (result) {
        return { message: "Merchant found", result };
      } else {
        return { message: "Merchant not found", statusCode: 400 };
      }
    })
    .catch((error) => {
      return { message: "Couldn't display data", statusCode: 400, error };
    });
}

// Update Merchant
async function modifyMerchant(merchant, id) {
  return await Merchant.updateOne({ _id: id }, { $set: merchant })
    .then((result) => {
      return { message: "Merchant Profile Updated Successfully", result };
    })
    .catch((err) => {
      return {
        message: "Error in updating merchant profile",
        statusCode: 400,
        err,
      };
    });
}
async function updateMerchant(MerchantData, id) {
  let res = await viewSpecificMerchant(id);
  if (res.statusCode == 400) {
    return res;
  } else {
    var a = await modifyMerchant(MerchantData, id);
    if (a.statusCode === 400) {
      removeImage(MerchantData.profileImage);
    } else if (
      MerchantData.profileImage &&
      MerchantData.profileImage != res.result.profileImage
    ) {
      removeImage(res.result.profileImage);
    }
    return a;
  }
}

// Delete Merchant
async function delMerchant(reqID) {
  return await Merchant.findByIdAndDelete({ _id: reqID })
    .then((result) => {
      return { message: "Merchant profile Deleted Successfully", result };
    })
    .catch((err) => {
      return {
        message: "Error in deleting merchant profile",
        statusCode: 400,
        err,
      };
    });
}
async function deleteMerchant(reqID) {
  let res = await viewSpecificMerchant(reqID);
  if (res.statusCode == 400) {
    return res;
  } else {
    var a = await delMerchant(reqID);
    if (a.statusCode != 400) {
      removeImage(a.result.profileImage);
    }
    return a;
  }
}

module.exports = {
  viewMerchant,
  updateMerchant,
  deleteMerchant,
  viewSpecificMerchant,
  checkPhoneNo,
};
