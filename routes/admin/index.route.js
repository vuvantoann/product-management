const dashboardRoute = require('./dashboard.route')
const productRoute = require('./product.route')
const systemConfig = require('../../config/system')
const categoryRoute = require('./category.route')
const settingRoute = require('./setting.route')
const roleRoute = require('./role.route')
const accountRoute = require('./account.route')
const authRoute = require('./auth.route')
const authMiddleware = require('../../middlewares/admin/auth.middleware')
module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin
  app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboardRoute)

  app.use(PATH_ADMIN + '/product', authMiddleware.requireAuth, productRoute)

  app.use(PATH_ADMIN + '/category', authMiddleware.requireAuth, categoryRoute)

  app.use(PATH_ADMIN + '/setting', authMiddleware.requireAuth, settingRoute)

  app.use(PATH_ADMIN + '/role', authMiddleware.requireAuth, roleRoute)

  app.use(PATH_ADMIN + '/account', authMiddleware.requireAuth, accountRoute)

  app.use(PATH_ADMIN + '/auth', authRoute)
}
