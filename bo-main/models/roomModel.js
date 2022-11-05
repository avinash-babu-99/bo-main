const mongoose = require("mongoose")


const schema = new mongoose.Schema({
  users: {
    type: [String],
    required: true
  }
})


const model = mongoose.model('rooms', schema)

module.exports = model
