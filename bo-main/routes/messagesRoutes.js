const express = require("express");
const controller = require("../controllers/messagesController");

const router = express.Router();

router.route("/sendMessage").post(controller.addMessage);

module.exports = router;
