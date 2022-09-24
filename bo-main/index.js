const express = require("express");
const morgan = require("morgan");
const getRouter = require("./routes/getRoutes");

const app = express();

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/data", getRouter);
app.all('*', (req, res, next) => {
  const err = new Error(`cannot find ${req.originalUrl} is not found in this server`);
  err.status = 'fail!!'
  err.statusCode = 404
  res.status(404).json({
    status: 'fail!!',
    message: `cannot find ${req.originalUrl} is not found in this server`
  })
  // next(error)
  next()
})
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500
//   err.message = err.message || 'error'
//   res.status(err.statusCode).json({
//     status: err.status,
//   })
// })

module.exports = app;
