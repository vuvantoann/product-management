// routes/client/service.route.js
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/service.controller')

router.get('/', controller.service)
module.exports = router
