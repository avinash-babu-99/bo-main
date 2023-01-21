const model = require("../models/contactUserModel");
const contactModel = require("../models/contactModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");


const signToken = (id) => {
  return jwt.sign(
    {
      id: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

}


exports.signup = catchAsync(async (req, res, next) => {
  const payload = {
    name: req.body.name,
    phone: req.body.phone,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }

  const response = await model.create({
    ...payload
  })


  if (response && response._id) {

    const token = signToken(response._id)
    res.set('Authorization', `Bearer ${token}`);
    res.status(201).json({
      message: 'Sign up success',
      token
    })
  } else {
    return next(new AppError('Sign up failed')
    )
  }

})

exports.protect = catchAsync(async (req, res, next) => {
  let token

  console.log(req.headers.authorization, 'auth');

  if (req.headers.authorization && req.headers.authorization.startsWith("bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in, please login to access", 401)
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError('Authentication failed', 401))
    }
    console.log(decoded, 'decoded');
  })

  next()

})

exports.login = catchAsync(async (req, res, next)=>{

})
