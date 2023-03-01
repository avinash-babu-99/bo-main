const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
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
