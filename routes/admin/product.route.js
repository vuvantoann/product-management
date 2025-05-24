const express = require('express')
const multer = require('multer')

const storageMulter = require('../../helper/storageMulter')
const upload = multer({ storage: storageMulter() })
const validate = require('../../validates/admin/product.validate')

const router = express.Router()

const controller = require('../../controllers/admin/product.controller')

router.get('/', controller.product)
router.patch('/change-status/:status/:id', controller.changeProductStatus)
router.patch('/change-multi', controller.changeMultipleStates)
router.delete('/delete/:id', controller.deleteProduct)

//create product
router.get('/create-product', controller.createProduct)
router.post(
  '/create-product',
  upload.single('thumbnail'),
  validate.createPost,
  controller.createProductPost
)

// edit product
router.get('/edit-product/:id', controller.editProduct)

router.patch(
  '/edit-product/:id',
  upload.single('thumbnail'),
  validate.createPost,
  controller.editProductPatch
)
module.exports = router
