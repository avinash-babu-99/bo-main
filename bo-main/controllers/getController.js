const fs = require("fs");
const { json } = require("express/lib/response");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`))
const DBModel = require("../models/getModel");

const APIFeatures = require("../utils/apiFeatures");

exports.getAll = async (req, res) => {
  try {
    // const queryObject = { ...req.query };
    // const excludeFields = ["page", "sort", "limit", "fields"];
    // excludeFields.forEach((value) => {
    //   delete queryObject[value];
    // });

    // let queryString = JSON.stringify(queryObject);
    // queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchValue) => {
    //   return `$${matchValue}`;
    // });

    // let query = DBModel.find(JSON.parse(queryString));

    // sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // }

    // limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    //paginating
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const datalength = await DBModel.countDocuments();
    //   if (skip >= datalength) {
    //     throw new Error("page doesnot exists");
    //   }
    // }

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
  } catch (err) {
    res.status(400).json({
      error: err,
      status: "error!!",
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await DBModel.findById(req.params.id);

    res.status(201).json({
      status: "success",
      data: data,
      dataCount: data.length,
    });
  } catch {
    res.status(400).json({
      status: "error!!!",
    });
  }
};

exports.postData = async (req, res) => {
  try {
    const newModel = await DBModel.create(req.body);

    res.status(201).json({
      status: "success",
      message: "posted!!!",
    });
  } catch(err) {
    res.status(400).json({
      status: "failed",
      error: err
    });
  }
};

exports.updateData = async (req, res) => {
  try {
    const data = await DBModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success updating",
      response: data,
    });
  } catch {
    res.status(400).json({
      status: "error!!!",
    });
  }
};

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

exports.getDataStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "error",
      error: err,
    });
  }
};

exports.getMonthly = async (req, res) => {
  try {
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
          alias: '$_id'
        }
      }
    ]);

    res.status(201).json({
      stats: "success",
      data: {
        stats: stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      error: err,
    });
  }
};
