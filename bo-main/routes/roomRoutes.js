const express = require("express");
const controller = require("../controllers/roomcontroller")



const router = express.Router()

router.route('/getRoom').get(controller.getRoom)
router.route('/newRoom').post(controller.newRoom)



module.exports = router
