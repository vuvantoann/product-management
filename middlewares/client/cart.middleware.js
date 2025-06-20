const Cart = require('../../modals/cart.modal')

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cartId) {
    const cart = new Cart()
    await cart.save()

    const expireCookie = 1000 * 60 * 60 * 24 * 365
    res.cookie('cartId', cart._id, {
      expires: new Date(Date.now() + expireCookie),
    })
  } else {
    //lấy ra thôi
  }
  next()
}
