const express = require('express')
const multer = require('multer')
const upload = multer()
const controller = require('../../controllers/admin/account.controller')
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const validate = require('../../validates/admin/account.validate')
const router = express.Router()

router.get('/', controller.account)

router.get('/create', controller.createAccount)

router.post(
  '/create',
  upload.single('avatar'),
  uploadCloud.upload,
  validate.createPost,
  controller.createAccountPost
)

module.exports = router
