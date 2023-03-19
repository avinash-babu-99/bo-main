const model = require("../models/messagesModel");
const roomModel = require("../models/roomModel")
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");

exports.addMessage = catchAsync(async (req, res, next) => {
  const payload = {
    roomId: req.body.data.room,
    message: req.body.data.message,
    sender: req.body.data.sendUser,
  };
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

exports.getUnreadMessages = catchAsync(async (req, res, next) => {

  const roomIds = req.body.roomIds

  const sender = req.body.sender

  const ids = roomIds.map((id) => {
    return mongoose.Types.ObjectId(id)
  })

  const senderId = mongoose.Types.ObjectId(sender)

  const response = await model.aggregate([{
    $match: {
      roomId: {
        $in: [
          ...ids
        ]
      },
      sender: {
        $ne: senderId
      }
    }
  },
  {
    $group: {
      _id: { roomId: "$roomId", status: "$status" },
      count: { $sum: 1 }
    }
  },
  { $match: { "_id.status": "unread" } },
  {
    $project: {
      _id: "$_id.roomId",
      count: "$count"
    }
  }
  ])

  res.status(201).json({
    message: 'success!',
    response
  })

})
