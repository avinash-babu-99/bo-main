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
  contacts: {
    type: Array,
  },
});

const DBModel = mongoose.model("contact", contactSchema);

module.exports = DBModel;
