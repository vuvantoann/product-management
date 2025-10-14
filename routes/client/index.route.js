const productRoute = require('./product.route')
const homeRoute = require('./home.route')
const service = require('./service.route')
const searchRoute = require('./search.route')

const categoryMiddleware = require('../../middlewares/client/category.middleware')
const cartMiddleware = require('../../middlewares/client/cart.middleware')
const userMiddleware = require('../../middlewares/client/user.middleware')
const settingMiddleware = require('../../middlewares/client/setting.middleware')
const authMiddleware = require('../../middlewares/client/auth.middleware')

const cartRoute = require('./cart.route')
const checkoutRoute = require('./checkout.route')
const userRoute = require('./user.route')
const contactRoute = require('./contact.route')
const chatRoute = require('./chat.route')

module.exports = (app) => {
  app.use(categoryMiddleware.category)
  app.use(cartMiddleware.cartId)
  app.use(userMiddleware.userInfo)
  app.use(settingMiddleware.settingGeneral)

  app.use('/', homeRoute)
  app.use('/product', productRoute)
  app.use('/service', service)
  app.use('/contact', contactRoute)

  app.use('/search', searchRoute)
  app.use('/cart', cartRoute)
  app.use('/checkout', checkoutRoute)

  app.use('/user', userRoute)

  app.use('/chat', authMiddleware.requireAuth, chatRoute)
}
