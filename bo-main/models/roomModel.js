const mongoose = require("mongoose")


const schema = new mongoose.Schema({
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true
  },
  lastMessage: {
    id: {
      type: mongoose.Schema.Types.ObjectId
    },
    message: {
      type: String
    }
  },
  lastChatted: {
    type: Date
  }
})


const model = mongoose.model('rooms', schema)

module.exports = model
