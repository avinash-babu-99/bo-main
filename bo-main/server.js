const mongoose = require("mongoose");

const dotenv = require("dotenv");
const app = require("./index");
dotenv.config({ path: "./config.env" });

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

const port = 400;
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
