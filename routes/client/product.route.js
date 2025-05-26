const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/product.controller')

router.get('/', controller.product)

router.get('/:slug', controller.detailProduct)

module.exports = router
