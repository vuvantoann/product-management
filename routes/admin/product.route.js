const express = require('express')
const multer = require('multer')

// const storageMulter = require('../../helper/storageMulter')
const upload = multer()
const validate = require('../../validates/admin/product.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
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
  uploadCloud.upload,
  validate.createPost,
  controller.createProductPost
)

// edit product
router.get('/edit-product/:id', controller.editProduct)

router.patch(
  '/edit-product/:id',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editProductPatch
)

// detail product
router.get('/detail-product/:id', controller.detailProduct)

module.exports = router
