const fs = require('fs')
const { json } = require('express/lib/response')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/data.json`))



exports.getAll = (req, res) => {
  res.status(201).json({
    status: 'Success',
    requestedAt: req.requestTime,
    datacount: tours.length,
    data: tours,
  })
}

exports.postData = (req, res) => {
  res.status(201).json({
    status: 'success',
    message: 'posted!!!'
  })
}


exports.checkRequest = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      status: '400',
      message: 'name is missed in payload'
    })
  }
  next()
}






