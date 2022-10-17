const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter a contact name!!!"],
  },
  contacts: {
    type: Array,
  },
});

const DBModel = mongoose.model("contact", contactSchema);

module.exports = DBModel;
