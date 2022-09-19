const fs = require("fs");
const { json } = require("express/lib/response");
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`))
const DBModel = require("../models/getModel");

exports.getAll = async (req, res) => {
  try {
    const data = await DBModel.find();

    res.status(201).json({
      status: "Success",
      requestedAt: req.requestTime,
      datacount: data.length,
      data: data,
    });
  } catch {
    res.status(400).json({
      error: "error !!",
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

// exports.checkRequest = (req, res, next) => {
//   if (!req.body.name) {
//     return res.status(400).json({
//       status: "400",
//       message: "name is missed in payload",
//     });
//   }
//   next();
// };
