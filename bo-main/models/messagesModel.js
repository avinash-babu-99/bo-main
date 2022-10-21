const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now(),
  },
});

const model = mongoose.model("messages", schema);

module.exports = model;
