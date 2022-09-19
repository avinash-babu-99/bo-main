const mongoose = require("mongoose");

const express = require("express");
const morgan = require("morgan");
const getRouter = require("./routes/getRoutes");

const app = express();
const DB = process.env.Database_connection_string.replace(
  "<password>",
  process.env.mongoPassword
);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DataBase connected");
  })
  .catch(() => {
    console.log("error connecting Data base");
  });

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/data", getRouter);

module.exports = app;
