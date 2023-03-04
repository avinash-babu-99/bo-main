const model = require("../models/roomModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const contactModel = require("../models/contactModel")
const { ObjectId } = require('mongodb');

exports.getRoom = catchAsync(async (req, res, next) => {

  const value = [...req.query.ids];

  console.log(value);

  const data = await model.find({ users: { $all: value } });

  console.log(data, "response");

  return res.status(200).json({
    message: "success!",
    data: data,
  });
});

exports.newRoom = catchAsync(async (req, res, next) => {
  const payload = {
    users: [...req.body.users],
  };
  console.log('users', [...req.body.users]);

  const postedData = await model.create(payload);

  // console.log(postedData, 'postedData');

  // if (req.body.users && (req.body.users.length == 2) && postedData) {

  //   console.log(postedData._id);

  //   let contactOne = new ObjectId(req.body.users[0])
  //   let contactTwo = new ObjectId(req.body.users[1])

  //   let contactOneValue = await contactModel.findById(contactOne).populate('contact')
  //   let contactOneIndex = contactOneValue.contacts.findIndex(contact => {
  //     console.log(contact.contact, 'contact.contact', typeof(contact.contact));
  //     console.log(contactTwo, 'contactTwo', typeof(contactTwo))
  //     console.log(contact.contact === contactTwo, 'contact.contact === contactTwo');
  //     return contact.contact.equals(contactTwo)
  //   }
  //   )
  //   let contactOneObject = {
  //     ...contactOneValue.contacts[contactOneIndex],
  //     roomId: postedData._id
  //   }

  //   console.log(contactOneValue, 'contactOneValue');
  //   console.log(contactOneIndex, 'contactOneIndex');

  //   console.log(contactOneValue.contacts[contactOneIndex], 'contactOneValue.contacts[contactOneIndex]');
  //   contactOneValue.contacts[contactOneIndex] = contactOneObject
  //   await contactOneValue.save()

  //   let contactTwoValue = await contactModel.findById(contactTwo).populate('contact')
  //   let contactTwoIndex = contactTwoValue.contacts.findIndex(contact => contact.contact === contactOne)
  //   let contactTwoObject = {
  //     ...contactTwoValue.contacts[contactTwoIndex],
  //     roomId: postedData._id
  //   }

  //   console.log(contactTwoValue.contacts[contactTwoIndex], 'contactTwoValue.contacts[contactTwoIndex]');
  //   contactTwoValue.contacts[contactTwoIndex] = contactTwoObject
  //   await contactTwoValue.save()

  // }

  return res.status(200).json({
    message: "success!",
    data: postedData,
  });
});
