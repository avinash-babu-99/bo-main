const contactModel = require("../models/contactModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getContacts = catchAsync(async (req, res, next) => {
  const users = await contactModel.find();

  res.status(201).json({
    status: "Success",
    requestedAt: req.requestTime,
    datacount: users.length,
    data: users,
  });
});

exports.getContactByPhone = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await contactModel.find({ phone: req.body.phone });
  console.log(user, "user");

  if (!user.length) {
    return next(new AppError("incorrect number", 400));
  }

  res.status(201).json({
    message: "success!!",
    user: user,
  });
});
