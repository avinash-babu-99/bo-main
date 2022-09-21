const fs = require("fs");
const { json } = require("express/lib/response");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`))
const DBModel = require("../models/getModel");

exports.getAll = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((value) => {
      delete queryObject[value];
    });

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchValue) => {
      return `$${matchValue}`;
    });

    let query = DBModel.find(JSON.parse(queryString));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }

    // limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //paginating
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    if (req.query.page){
      const datalength = await DBModel.countDocuments()
      if(skip >= datalength){
        throw new Error('page doesnot exists')
      }
    }

    const data = await query;

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
  } catch {
    res.status(400).json({
      status: "failed",
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

// middlewares

exports.getTopYoung = async(req, res, next) => {
  req.query.limit = '2',
  req.query.sort = 'age'
  next()
}

// exports.checkRequest = (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       status: "400",
//       message: "name is missed in payload",
//     });
//   }
//   next();
// };
