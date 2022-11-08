const model = require("../models/roomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getRoom = catchAsync(async (req, res, next) => {
  console.log("requested");
  console.log(req.query.ids, "body check");

  const value = [...req.query.ids];

  console.log(value);

  const data = await model.find({ users: { $all: value } });

  console.log(data, "response");

  return res.status(200).json({
    message: "success!",
    data: data,
  });
});

exports.newRoom = catchAsync(async (req, res, next) => {
  const payload = {
    users: [...req.body.users],
  };

  const postedData = await model.create(payload);
  return res.status(200).json({
    message: "success!",
    data: postedData,
  });
});
