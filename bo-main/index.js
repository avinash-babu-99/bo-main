const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");
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
