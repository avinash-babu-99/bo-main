const express = require("express");

const contactController = require("../controllers/contactController");
const contactUserController = require("../controllers/contactUserController")

const router = express.Router();

router.route("/").get(contactUserController.protect, contactController.getContacts);
router.route("/contactLogin").post(contactController.getContactByPhone);
router.route("/addFriendsList").post(contactController.getAddFriends);
router.route("/addFriendRequest").patch(contactController.addFriendRequest);
router
  .route("/acceptOrRejectFriendRequest")
  .patch(contactController.acceptOrRejectFriendRequest);
router.route("/removeContact").patch(contactController.removeFriend);
router.route("/aggregate").get(contactController.aggregateTest)
router.route("/:id").get(contactController.getContactById)
router.route("/:id").patch(contactController.findByIdAndUpdate)
router.route("/uploadProfile").post(contactUserController.protect, contactController.uploadUserProfile, contactController.saveProfilePhotoDetails)
router.route("/generateProfilesBase64").post(contactController.generateProfilesBase64)

module.exports = router;
