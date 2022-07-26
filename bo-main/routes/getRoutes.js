const express = require("express");
const getController = require("../controllers/getController");
const fs = require("fs");
const router = express.Router();

router.route("/").get(getController.getAll);
router.route("/:id").get(getController.getById);
router.route("/update/:id").patch(getController.updateData);
router.route("/post").post(getController.postData);

module.exports = router;
