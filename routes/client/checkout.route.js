// routes/client/checkout.route.js
const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/checkout.controller')

router.get('/', controller.checkout)

router.post('/order', controller.order)

router.get('/success/:orderId', controller.success)

router.get('/buy-now/:productId', controller.buyNow)

router.post('/order-buy-now', controller.orderBuyNow)

module.exports = router
