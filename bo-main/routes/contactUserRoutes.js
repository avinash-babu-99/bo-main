const express = require('express')

const controller = require("../controllers/contactUserController")
const router = express.Router()


router.post('/signUp', controller.signup)


module.exports = router
