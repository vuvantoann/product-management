const categoryMiddleware = require('../../middlewares/client/category.middleware')
const productRoute = require('./product.route')
const homeRoute = require('./home.route')
const service = require('./service.route')
module.exports = (app) => {
  app.use(categoryMiddleware.category)
  app.use('/', homeRoute)
  app.use('/product', productRoute)
  app.use('/service', service)
}
