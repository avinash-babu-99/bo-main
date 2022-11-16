const contactModel = require("../models/contactModel");
const catchAsync = require("../utils/catchAsync");
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
  console.log(req.body, "body");
  const fromObject = filterObject(fromPayload, "_id");
  const fromResponse = await contactModel.findByIdAndUpdate(fromPayload._id, {
    sentFriendRequests: [...fromPayload.sentFriendRequests],
  });

  console.log(fromResponse, "fromResponse");

  const toPayload = req.body.to;
  const toObject = filterObject(toPayload, "_id");
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
