const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter a contact name!!!"],
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Enter you phone number"],
    unique: true,
  },
  userDetail: {
    type: mongoose.Schema.ObjectId,
    select: false
  },
  contacts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "contact",
    },
  ],
  sentFriendRequests: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "contact",
    },
  ],
  receivedFriendRequests: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "contact",
    },
  ],
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "offline",
  },
});

const DBModel = mongoose.model("contact", contactSchema);

module.exports = DBModel;
