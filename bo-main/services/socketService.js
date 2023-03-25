const { Mongoose } = require('mongoose')
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

  console.log(roomId, 'room id' , sender, 'sender');
  // console.log(roomObjectId, senderObjectId, '24');
 

  if ( roomId && sender ) {

    const roomObjectId = Mongoose.Types.ObjectId(roomId)
    const senderObjectId = Mongoose.Types.ObjectId(sender)

    console.log(roomObjectId, senderObjectId, '30');

    try {

      await messageModel.updateMany({ roomId: roomObjectId, sender: senderObjectId, status: { $eq: "unread" } }, { $set: { status: "read" } })

    } catch (error) {

      console.log('error handling reading room messages');

    }


  }

}
