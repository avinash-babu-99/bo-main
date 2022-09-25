const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/signUp").post(authenticationController.signUp);
router.route("/login").post(authenticationController.login);

router.route("/").get(userController.getUsers).post();
router.route("/:id").get().patch().delete();

module.exports = router;
