const express = require('express')
const multer = require('multer')
const router = express.Router()
const upload = multer()
const validate = require('../../validates/admin/product.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const controller = require('../../controllers/admin/category.controller')

router.get('/', controller.category)

router.get('/create', controller.createCategory)
router.post(
  '/create',
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createCategoryPost
)

module.exports = router
