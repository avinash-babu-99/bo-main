const model = require("../models/contactUserModel");
const contactModel = require("../models/contactModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const { promisify } = require("util");



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

  const userDetailsPayload = {
    name: response.name,
    phone: response.phone,
    userDetail: response._id,
    contacts: [],
    sentFriendRequests: [],
    receivedFriendRequests: []
  }

  const userResponse = await contactModel.create({
    ...userDetailsPayload
  })


  if (response && response._id && userResponse) {

    const token = signToken(response._id)
    // res.set('Authorization', `Bearer ${token}`);
    // res.cookie('Auth-token', token, {sameSite: 'none'});
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

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in, please login to access", 401)
    );
  }

  let decodedValue

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError('Authentication failed', 401))
    }

    decodedValue = decoded
  })

  const currentUser = await model.findById(decodedValue.id);

  if (!currentUser) {
    return next(
      new AppError("the user belonging to the token no longer exists", 401)
    );
  }

  if (currentUser.changePasswordAfter(decodedValue.iat)) {
    return next(
      new AppError("Password changed recently, please login again", 401)
    );
  }

  req.user = currentUser

  next()

})

exports.login = catchAsync(async (req, res, next) => {

  const response = await model.findOne({
    phone: req.body.phone
  }).select('+password')

  if (!response._id || !(await response.correctPassword(req.body.password, response.password))) {
    return next(new AppError("email or password is incorrect", 400));
  }

  const userDetails = await contactModel.findOne({
    phone: req.body.phone
  }).populate("contacts.contact").populate("sentFriendRequests").populate("receivedFriendRequests")

  const token = signToken(response._id)

  response.password = undefined;

  res.set('Authorization', `Bearer ${token}`);
  res.status(201).json({
    message: 'Login success',
    token: token,
    user: userDetails
    })

})
