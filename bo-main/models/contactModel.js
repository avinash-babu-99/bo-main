const mongoose = require("mongoose");

const contactListSchema = new mongoose.Schema({
  contact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'contact'
  },
  // roomId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'rooms',
  // },
  status: {
    type: String,
    default: 'online'
  },
  // unReadMessagesCount: {
  //   type: Number,
  //   default: 0
  // }
});

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
    contactListSchema
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
