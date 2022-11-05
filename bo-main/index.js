const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require('hpp')
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
const getRouter = require("./routes/getRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// set security http headers
app.use(helmet())

//Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));

// data sanitization against NoSql query injection
app.use(mongoSanitize())

// data sanitization against xss
app.use(xss())

// params sanitization
app.use(hpp({
  whitelist:[]
}))

// dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
})

// limiting request from same IP
app.use('/data',limiter)


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/data", getRouter);
app.use("/users", userRouter);
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `cannot find ${req.originalUrl} is not found in this server`,
      404
    )
  );
});
app.use(errorHandler);

module.exports = app;
