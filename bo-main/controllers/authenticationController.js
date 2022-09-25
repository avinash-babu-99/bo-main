const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

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
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token: token,
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if the email and password is given
  if (!email || !password) {
    return next(new AppError("please provide Email and password", 400));
  }

  // checking if the user exists & password is correct
  const user = await userModel.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("email or password is incorrect", 400));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success!",
    token: token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("you are not logged in, please login to access", 401)
    );
  }
  next();
});
