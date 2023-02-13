const express = require("express");

const contactController = require("../controllers/contactController");
const contactUserController = require("../controllers/contactUserController")

const router = express.Router();

router.route("/").get(contactController.getContacts);
router.route("/contactLogin").post(contactController.getContactByPhone);
router.route("/addFriendsList").post(contactController.getAddFriends);
router.route("/addFriendRequest").patch(contactController.addFriendRequest);
router
  .route("/acceptOrRejectFriendRequest")
  .patch(contactController.acceptOrRejectFriendRequest);
router.route("/removeContact").patch(contactController.removeFriend);
router.route("/:id").get(contactController.getContactById)
router.route("/:id").patch(contactController.findByIdAndUpdate)

module.exports = router;
