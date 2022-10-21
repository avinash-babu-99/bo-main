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
    phone: "12345",
    contacts: [
      {
        name: "person 2",
        roomId: "12345_12346",
      },
      {
        name: "person 3",
        roomId: "12345_12347",
      },
    ],
  },
  {
    name: "person 2",
    phone: "12346",
    contacts: [
      {
        name: "person 1",
        roomId: "12345_12346",
      },
      {
        name: "person 3",
        roomId: "12346_12347",
      },
    ],
  },
  {
    name: "person 3",
    phone: "12347",
    contacts: [
      {
        name: "person 1",
        roomId: "12345_12347",
      },
      {
        name: "person 2",
        roomId: "12346_12347",
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
    console.log("delete successful!!");
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
