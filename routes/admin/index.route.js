const dashboardRoute = require('./dashboard.route')
const productRoute = require('./product.route')
const systemConfig = require('../../config/system')
const categoryRoute = require('./category.route')
const settingRoute = require('./setting.route')
const roleRoute = require('./role.route')
const accountRoute = require('./account.route')

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin
  app.use(PATH_ADMIN + '/dashboard', dashboardRoute)

  app.use(PATH_ADMIN + '/product', productRoute)

  app.use(PATH_ADMIN + '/category', categoryRoute)

  app.use(PATH_ADMIN + '/setting', settingRoute)

  app.use(PATH_ADMIN + '/role', roleRoute)

  app.use(PATH_ADMIN + '/account', accountRoute)
}
