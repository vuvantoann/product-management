const Cart = require('../../modals/cart.modal')

module.exports.cartId = async (req, res, next) => {
  try {
    let cart

    if (!req.cookies.cartId) {
      // Nếu chưa có cartId thì tạo mới
      cart = new Cart()
      await cart.save()

      const expireCookie = 1000 * 60 * 60 * 24 * 30 // 30 ngày
      res.cookie('cartId', cart._id.toString(), {
        expires: new Date(Date.now() + expireCookie),
        httpOnly: true, // tăng bảo mật
      })
    } else {
      // Nếu có cartId, tìm trong DB
      cart = await Cart.findById(req.cookies.cartId)

      // Nếu cart không tồn tại (cartId cũ, bị xóa...), tạo mới
      if (!cart) {
        cart = new Cart()
        await cart.save()

        res.cookie('cartId', cart._id.toString(), {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          httpOnly: true,
        })
      }
    }

    // Cập nhật số lượng sản phẩm trong giỏ
    cart.totalQuantityInCart = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
    res.locals.miniCart = cart

    next()
  } catch (err) {
    console.error('Error in cart middleware:', err)
    next(err) // chuyển lỗi cho error handler nếu có
  }
}
