// routes/client/cart.route.js
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/cart.controller')

router.post('/add/:productId', controller.cart)
module.exports = router
