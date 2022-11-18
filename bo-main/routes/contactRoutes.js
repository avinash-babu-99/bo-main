const express = require("express");

const contactController = require("../controllers/contactController");

const router = express.Router();

router.route("/").get(contactController.getContacts);
router.route("/contactLogin").post(contactController.getContactByPhone);
router.route("/addFriendsList").post(contactController.getAddFriends);
router.route("/addFriendRequest").patch(contactController.addFriendRequest);
router
  .route("/acceptOrRejectFriendRequest")
  .patch(contactController.acceptOrRejectFriendRequest);
router.route("/removeContact").patch(contactController.removeFriend);

module.exports = router;
