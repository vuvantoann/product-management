const categoryMiddleware = require('../../middlewares/client/category.middleware')
const productRoute = require('./product.route')
const homeRoute = require('./home.route')
const service = require('./service.route')
const searchRoute = require('./search.route')
module.exports = (app) => {
  app.use(categoryMiddleware.category)
  app.use('/', homeRoute)
  app.use('/product', productRoute)
  app.use('/service', service)

  app.use('/search', searchRoute)
}
