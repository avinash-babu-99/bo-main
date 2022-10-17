const express = require("express");

const contactController = require("../controllers/contactController");

const router = express.Router();

router.route("/").get(contactController.getContacts);

module.exports = router;
