const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const userModel = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const sendMailTest = require("../utils/testNodeMailer");

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

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
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

  createSendToken(user, 200, res);
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

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await userModel.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("the user belonging to the token no longer exists", 401)
    );
  }

  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password changed recently, please login again", 401)
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you are not authorized for this action", 403));
    }
    return next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get the user
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user) {
    return next(new AppError("The email ID doesnot exists", 404));
  }

  //generating a token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/users/resetPassword/${resetToken}`;

  const message = `forgot your password? Submit a new patch request with new password and confirm password to ${resetURL} \n If you did not forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your reset token (valid for 10 minutes)",
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "token sent to your Email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending Email, please try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hasedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // verifying the token
  const user = await userModel.findOne({
    passwordResetToken: hasedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  console.log(user, "user");
  if (!user) {
    return next(new AppError("Token in invalid or has expired", 400));
  }

  // reseting the token
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // giving the token for Login

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(AppError("Your current Password is wrong!", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});

exports.testNodeMailer = catchAsync(async (req, res, next) => {
  await sendMailTest();
  res.status(200).json({
    status: "success",
    message: "Email is sent",
  });
});
