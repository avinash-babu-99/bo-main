const mongoose = require("mongoose");

const DBSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const DBModel = mongoose.model("prac2", DBSchema);

module.exports = DBModel;
