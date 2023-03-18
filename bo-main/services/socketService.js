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

  if ( roomId && sender ) {

    try {

      await messageModel.updateMany({ roomId: roomId, sender: sender, status: { $ne: "read" } }, { $set: { status: "read" } })

    } catch (error) {

      console.log('error handling reading room messages');

    }


  }

}
