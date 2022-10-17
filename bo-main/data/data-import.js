const mongoose = require("mongoose");

const fs = require("fs");
// const DBModel = require("../models/getModel");
const DBModel = require("../models/contactModel");
const dotenv = require("dotenv");
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

// const data = JSON.parse(fs.readFileSync(`${__dirname}/my-data.json`, "utf-8"));

const data = [
  {
    name: "person 1",
    contacts: [
      {
        name: "person 2",
        roomId: 1,
      },
      {
        name: "person 3",
        roomId: 2,
      },
    ],
  },
  {
    name: "person 2",
    contacts: [
      {
        name: "person 1",
        roomId: 1,
      },
      {
        name: "person 3",
        roomId: 4,
      },
    ],
  },
  {
    name: "person 3",
    contacts: [
      {
        name: "person 1",
        roomId: 2,
      },
      {
        name: "person 2",
        roomId: 4,
      },
    ],
  },
];

const importData = async () => {
  try {
    await DBModel.create(data);
    console.log("data imported");
    process.exit();
  } catch (err) {
    console.log(err, "error importing");
  }
};

const deleteData = async () => {
  try {
    await DBModel.deleteMany();
    console.log("delete successfull!!");
    process.exit();
  } catch (err) {
    console.log("error deleting");
  }
};

console.log(process.argv, "argv");

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
