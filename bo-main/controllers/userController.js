const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.find();

  res.status(201).json({
    status: "Success",
    requestedAt: req.requestTime,
    datacount: users.length,
    data: users,
  });
});
