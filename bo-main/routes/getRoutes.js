const express = require("express");
const getController = require("../controllers/getController");
const authenticationController = require("../controllers/authenticationController");

const fs = require("fs");
const router = express.Router();

router.route("/").get(authenticationController.protect, getController.getAll);
router.route("/topYoung").get(getController.getTopYoung, getController.getAll);
router.route("/stats").get(getController.getMonthly);
router
  .route("/:id")
  .get(getController.getById)
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo("admin"),
    getController.deleteData
  );
router.route("/update/:id").patch(getController.updateData);
router.route("/post").post(getController.postData);

module.exports = router;
