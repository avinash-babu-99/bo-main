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
});

const DBModel = mongoose.model("contact", contactSchema);

module.exports = DBModel;
