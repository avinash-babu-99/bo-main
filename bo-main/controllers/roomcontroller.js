const model = require("../models/roomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const contactModel = require("../models/contactModel")
const { ObjectId } = require('mongodb');

exports.getRoom = catchAsync(async (req, res, next) => {

  const value = [...req.query.ids];

  console.log(value);

  const data = await model.find({ users: { $all: value } });

  return res.status(200).json({
    message: "success!",
    data: data,
  });
});

exports.newRoom = catchAsync(async (req, res, next) => {
  let users = req.body.users
  const payload = {
    users: [...req.body.users],
  };

  const contactId = users[0]
  const userId = users[1]

  let user = await contactModel.findById(userId).populate("contacts.contact")

  let userIndex = user.contacts.findIndex((contact)=>{
    return contact.contact._id.equals(contactId)
  })

  let contact = await contactModel.findById(contactId).populate("contacts.contact")

  let contactIndex = contact.contacts.findIndex((contact)=>{
    return contact.contact._id.equals(userId)
  })

  const postedData = await model.create(payload);

  contact.contacts[contactIndex]['roomId'] = postedData._id;

  user.contacts[userIndex]['roomId'] = postedData._id;

  await contact.save()

  await user.save()

  return res.status(200).json({
    message: "success!",
    data: postedData,
  });
});
