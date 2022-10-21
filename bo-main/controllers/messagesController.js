const model = require("../models/messagesModel");
const catchAsync = require("../utils/catchAsync");

exports.addMessage = catchAsync(async (req, res, next) => {
  console.log(req.body, "body");
  const payload = {
    roomId: req.body.data.room,
    message: req.body.data.message,
  };
  console.log(payload);
  const postedData = await model.create(payload);
  res.status(201).json({
    status: "success, message received",
    sentMessage: postedData,
  });
});
