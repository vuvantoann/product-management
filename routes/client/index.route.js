const productRoute = require('./product.route')
const homeRoute = require('./home.route')
const service = require('./service.route')
const searchRoute = require('./search.route')

const categoryMiddleware = require('../../middlewares/client/category.middleware')
const cartMiddleware = require('../../middlewares/client/cart.middleware')

const cartRoute = require('./cart.route')

module.exports = (app) => {
  app.use(categoryMiddleware.category)
  app.use(cartMiddleware.cartId)

  app.use('/', homeRoute)
  app.use('/product', productRoute)
  app.use('/service', service)

  app.use('/search', searchRoute)
  app.use('/cart', cartRoute)
}
