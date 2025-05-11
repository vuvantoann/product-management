const express = require('express')
const router = express.Router()

const controller = require('../../controllers/admin/product.controller')

router.get('/', controller.product)
router.patch('/change-status/:status/:id', controller.changeProductStatus)
router.patch('/change-multi', controller.changeMultipleStates)
router.delete('/delete/:id', controller.deleteProduct)

module.exports = router
