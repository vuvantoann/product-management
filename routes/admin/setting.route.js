const express = require('express')

const multer = require('multer')
const upload = multer()
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const router = express.Router()
const controller = require('../../controllers/admin/setting.controller')

router.get('/', controller.setting)

router.get('/general', controller.general)

router.patch(
  '/general',
  upload.single('logo'),
  uploadCloud.upload,

  controller.generalPatch
)

module.exports = router
