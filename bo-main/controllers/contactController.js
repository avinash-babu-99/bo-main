const contactModel = require("../models/contactModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const AppError = require("../utils/appError");

const filterObject = (obj, ...otherFields) => {
  let finalObject = {};
  Object.keys(obj).forEach((el) => {
    if (otherFields.includes(el)) {
      finalObject[el] = obj[el];
    }
  });

  return finalObject;
};

exports.getContacts = catchAsync(async (req, res, next) => {

  console.log('coming contacts api');
  const users = await contactModel.find().populate("contacts");

  res.status(201).json({
    status: "Success",
    requestedAt: req.requestTime,
    datacount: users.length,
    data: users,
  });
});

exports.getContactByPhone = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await contactModel
    .find({ phone: req.body.phone })
    .populate("contacts")
    .populate("sentFriendRequests")
    .populate("receivedFriendRequests");

  // await user.populate("users").execPopulate();
  console.log(user, "user");

  if (!user.length) {
    return next(new AppError("incorrect number", 400));
  }

  res.status(201).json({
    message: "success!!",
    user: user,
  });
});

exports.getAddFriends = catchAsync(async (req, res, next) => {
  let searchArray = req.body.searchArray;
  const users = await contactModel
    .find({ _id: { $nin: searchArray } })
    .populate("contacts");

  res.status(201).json({
    status: "success",
    users,
  });
});

exports.addFriendRequest = catchAsync(async (req, res, next) => {
  const fromPayload = req.body.from;
  const fromResponse = await contactModel.findByIdAndUpdate(fromPayload._id, {
    sentFriendRequests: [...fromPayload.sentFriendRequests],
  });

  const toPayload = req.body.to;
  console.log(toPayload._id);
  const toResponse = await contactModel.findByIdAndUpdate(toPayload._id, {
    receivedFriendRequests: [...toPayload.receivedFriendRequests],
  });

  console.log(toResponse, "toResponse");

  res.status(201).json({
    status: "Success",
    message: "Request Sent!!",
  });
});

exports.acceptOrRejectFriendRequest = catchAsync(async (req, res, next) => {
  console.log(req.body, "body");
  const fromPayload = req.body.from;
  const toPayload = req.body.to;

  const fromResponse = await contactModel.findByIdAndUpdate(fromPayload._id, {
    $pull: { receivedFriendRequests: toPayload._id },
  });

  const toResponse = await contactModel.findByIdAndUpdate(toPayload._id, {
    $pull: { sentFriendRequests: fromPayload._id },
  });

  if (req.body.action === "accept") {
    const fromResponse = await contactModel.findByIdAndUpdate(fromPayload._id, {
      $push: { contacts: toPayload._id },
    });

    const toResponse = await contactModel.findByIdAndUpdate(toPayload._id, {
      $push: { contacts: fromPayload._id },
    });
  }

  console.log(req.body, "req.body");

  res.status(201).json({
    status: "success!",
    message: "status updated",
  });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
  const removeResponse = await contactModel.findByIdAndUpdate(req.body._id, {
    $pull: { contacts: req.body.contactId },
  });

  const Response = await contactModel.findByIdAndUpdate(req.body.contactId, {
    $pull: { contacts: req.body._id },
  });

  res.status(201).json({
    status: "success!",
    message: "status updated",
  });
});

exports.getContactById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let user;
  if (id) {
    user = await contactModel
      .findById(id)
      .populate("contacts")
      .populate("sentFriendRequests")
      .populate("receivedFriendRequests");
  }

  if (user) {
    res.status(201).json({
      status: "success",
      response: user,
    });
  }
});


exports.findByIdAndUpdate = catchAsync(async(req, res, next)=>{
  const id = req.params.id;
  let user
  if (id) {
    user = await contactModel
      .findByIdAndUpdate(id, req.body, {
        new: true,
      })
      .populate("contacts")
      .populate("sentFriendRequests")
      .populate("receivedFriendRequests");
  }

  if( user ) {
    res.status(201).json({
      status:'updated successfully',
      response: user
    })
  }
})
