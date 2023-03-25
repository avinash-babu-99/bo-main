const mongoose = require("mongoose");
const messageModel = require('../models/messagesModel')


exports.handleRoomMessagesStatus = async(contact)=>{

  let roomId

  if ( contact && contact.roomId && contact.roomId._id ) {

    roomId = contact.roomId._id

  }

  let sender

  if ( contact && contact.contact && contact.contact._id ) {

    sender = contact.contact._id

  }

 

  if ( roomId && sender ) {

    const roomObjectId = mongoose.Types.ObjectId(roomId)
    const senderObjectId = mongoose.Types.ObjectId(sender)

    console.log(roomObjectId, senderObjectId, '30');

    try {

      await messageModel.updateMany({ roomId: roomObjectId, sender: senderObjectId, status: { $eq: "unread" } }, { $set: { status: "read" } })

    } catch (error) {

      console.log('error handling reading room messages');

    }


  }

}
