const express = require('express')
const getController =  require('../controllers/getController')
const fs = require('fs')
const router = express.Router()


router.route('/').get(getController.getAll)
router.route('/post').post(getController.checkRequest,getController.postData)

module.exports = router
