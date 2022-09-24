const fs = require("fs");
// const { json } = require("express/lib/response");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`))
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const DBModel = require("../models/getModel");

const APIFeatures = require("../utils/apiFeatures");

exports.getAll = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DBModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const data = await features.query;

  res.status(201).json({
    status: "Success",
    requestedAt: req.requestTime,
    datacount: data.length,
    data: data,
  });
});

exports.getById = catchAsync(async (req, res, next) => {
  const data = await DBModel.findById(req.params.id);

  if (!data) {
    return next(new AppError("No data found in this ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: data,
    dataCount: data.length,
  });
});

exports.postData = catchAsync(async (req, res, next) => {
  const newModel = await DBModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "posted!!!",
  });
});

exports.updateData = catchAsync(async (req, res, next) => {
  const data = await DBModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    return next(new AppError("No data found in this ID", 404));
  }

  res.status(200).json({
    status: "success updating",
    response: data,
  });
});

exports.deleteData = catchAsync(async (req, res, next) => {
  const data = await DBModel.findByIdAndDelete(req.params.id);

  if (!data) {
    return next(new AppError("No data found in this ID", 404));
  }
  res.status(204).json({
    status: "success",
  });
});

// middleware

exports.getTopYoung = async (req, res, next) => {
  (req.query.limit = "2"), (req.query.sort = "age");
  next();
};

// exports.checkRequest = (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       status: "400",
//       message: "name is missed in payload",
//     });
//   }
//   next();
// };

exports.getDataStats = catchAsync(async (req, res, next) => {
  const stats = await DBModel.aggregate([
    {
      $match: {
        age: {
          $gte: 15,
        },
      },
    },
    {
      $group: {
        _id: "$age",
        num: {
          $sum: 1,
        },
        numAge: {
          $sum: "$age",
        },
        avgAge: {
          $avg: "$age",
        },
        minAge: {
          $min: "$age",
        },
      },
    },
    {
      $sort: {
        numAge: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success!",
    data: {
      stats: stats,
    },
  });
});

exports.getMonthly = catchAsync(async (req, res) => {
  const stats = await DBModel.aggregate([
    {
      $unwind: "$alias",
    },
    {
      $limit: 5,
    },
    {
      $group: {
        _id: "$alias",
        // alias: "$alias",
      },
    },
    {
      $addFields: {
        alias: "$_id",
      },
    },
  ]);

  res.status(201).json({
    stats: "success",
    data: {
      stats: stats,
    },
  });
});
