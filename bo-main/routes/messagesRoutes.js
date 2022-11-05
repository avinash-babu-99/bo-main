const express = require("express");
const controller = require("../controllers/messagesController");

const router = express.Router();

router.route("/sendMessage").post(controller.addMessage);
router.route("/getMessages/:room").get(controller.getMessages);

module.exports = router;
