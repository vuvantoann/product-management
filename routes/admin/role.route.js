const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/role.controller')
const validate = require('../../validates/admin/product.validate')

router.get('/', controller.role)

router.get('/create', controller.createRole)
router.post('/create', validate.createPost, controller.createRolePost)

module.exports = router
