const express = require("express");

const contactController = require("../controllers/contactController");

const router = express.Router();

router.route("/").get(contactController.getContacts);
router.route("/contactLogin").post(contactController.getContactByPhone);
router.route("/addFriendsList").post(contactController.getAddFriends);

module.exports = router;
