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
    const cart = await Cart.findOne({ _id: req.cookies.cartId })

    cart.totalQuantityInCart = cart.products.reduce((sum, item) => {
      return sum + item.quantity
    }, 0)

    res.locals.miniCart = cart
    //lấy ra thôi
  }
  next()
}
