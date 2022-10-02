const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/signUp").post(authenticationController.signUp);
router.route("/login").post(authenticationController.login);
router.route("/forgotPassword").post(authenticationController.forgotPassword);
router
  .route("/resetPassword/:token")
  .patch(authenticationController.resetPassword);
router
  .route("/updatePassword")
  .patch(
    authenticationController.protect,
    authenticationController.updatePassword
  );
router.route("/testNodeMailer").post(authenticationController.testNodeMailer);

router.route("/").get(userController.getUsers).post();
router.route("/:id").get().patch().delete();

module.exports = router;
