const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObject = (obj, ...otherFields) => {
  let finalObject = {}
  Object.keys(obj).forEach(el => {
    if (otherFields.includes(el)) {
      finalObject[el] = obj[el]
    }
  })

  return finalObject
}

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.find();


  const cookieOptions = {
    httpOnly: true,
    path: '/users'
  };

  res.cookie("jwt", "dsdadsadsa", cookieOptions);

  res.status(201).json({
    status: "Success",
    requestedAt: req.requestTime,
    datacount: users.length,
    data: users,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates, please use /updatePassword'))
  }

  // filtering the fields that are not allowed to be updated
  const filterBody = filterObject(req.body, 'name', 'email')

  const Updateduser = await userModel.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: 'success',
    data: Updateduser
  })
})

exports.deleteMe = catchAsync(async(req, res, next)=>{
  await userModel.findByIdAndUpdate(req.user.id, {active: false})

  res.status(204).json({
    status: 'success!',
    Response: null
  })
})
