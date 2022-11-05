const model = require('../models/roomModel')
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");



exports.getRoom = catchAsync(async(req, res, next)=>{

  const value = ["6352db7845b7442168d39d7e","6352db7845b7442168d39d7f" ]
  // const value = ["check"]

  const data = await model.find({users: {$all: value}})

  return res.status(200).json({
    message:"success!",
    data: data
  })

})


exports.newRoom = catchAsync(async(req, res, next)=>{
  const payload = {
    users: [...req.body.users]
  }

  const postedData = await model.create(payload)
  return res.status(200).json({
    message:"success!",
    data: postedData
  })
})

