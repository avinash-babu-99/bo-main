const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["unread", "read", "error"],
    default: "unread"
  },
  sentAt: {
    type: Date,
    default: Date.now(),
  },
});

const model = mongoose.model("messages", schema);

module.exports = model;
