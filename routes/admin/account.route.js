const express = require('express')
const multer = require('multer')
const upload = multer()
const controller = require('../../controllers/admin/account.controller')
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const validate = require('../../validates/admin/account.validate')
const router = express.Router()

router.get('/', controller.account)

//create account
router.get('/create', controller.createAccount)

router.post(
  '/create',
  upload.single('avatar'),
  uploadCloud.upload,
  validate.createPost,
  controller.createAccountPost
)

//edit account
router.get('/edit/:id', controller.editAccount)

router.patch(
  '/edit/:id',
  upload.single('avatar'),
  uploadCloud.upload,
  validate.editPatch,
  controller.editAccountPatch
)

module.exports = router
