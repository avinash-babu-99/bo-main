const model = require("../models/messagesModel");
const catchAsync = require("../utils/catchAsync");

exports.addMessage = catchAsync(async (req, res, next) => {
  console.log(req.body, "body");
  const payload = {
    roomId: req.body.data.room,
    message: req.body.data.message,
    sender: req.body.data.sendUser,
  };
  console.log(payload);
  const postedData = await model.create(payload);
  res.status(201).json({
    status: "success, message received",
    sentMessage: postedData,
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const roomId = req.params.room;
  const messages = await model.find({
    roomId: roomId,
  });
  res.status(201).json({
    status: "success",
    messages,
    chatLength: messages.length,
  });
});
