const mongoose = require("mongoose");

const DBSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  value: {
    type: Number,
  },
});

const DBModel = mongoose.model("prac2", DBSchema);

module.exports = DBModel;
