const model = require("../models/messagesModel");
const roomModel = require("../models/roomModel")
const catchAsync = require("../utils/catchAsync");

exports.addMessage = catchAsync(async (req, res, next) => {
  const payload = {
    roomId: req.body.data.room,
    message: req.body.data.message,
    sender: req.body.data.sendUser,
  };
  console.log(payload);
  const postedData = await model.create(payload);

  let room = await roomModel.findById(req.body.data.room)

  room.lastMessage = {
    id: payload.sender,
    message: payload.message
  }

  room.lastChatted = Date.now()

  await room.save()

  res.status(201).json({
    status: "success, message received",
    sentMessage: postedData,
    roomData: {
      ...payload, date: Date.now()
    }
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
