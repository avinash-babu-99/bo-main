const userModel = require("../models/contactModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getContacts = catchAsync(async (req, res, next) => {
  const users = await userModel.find();

  res.status(201).json({
    status: "Success",
    requestedAt: req.requestTime,
    datacount: users.length,
    data: users,
  });
});
