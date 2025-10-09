// routes/client/service.route.js
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/contact.controller')

router.get('/', controller.contact)
module.exports = router
