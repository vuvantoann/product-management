const Cart = require('../../modals/cart.modal')
const Product = require('../../modals/product.modal')
const {
  priceNewProduct,
  priceNewSingleProduct,
} = require('../../helper/product')
const { formatCurrency } = require('../../helper/format')
//[GET] /Cart
module.exports.cart = async (req, res) => {
  const cart = await Cart.findOne({ _id: req.cookies.cartId })

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id
      const productInfo = await Product.findOne({ _id: productId }).select(
        'title thumbnail slug price discountPercentage stock'
      )
      const newProductInfo = priceNewSingleProduct(productInfo)

      item.productInfo = newProductInfo
      item.totalPriceRaw = newProductInfo.priceNewRaw * item.quantity

      item.totalPrice = formatCurrency(item.totalPriceRaw)
    }
  }

  const totalPriceCart = cart.products.reduce(
    (sum, item) => sum + item.totalPriceRaw,
    0
  )

  cart.totalPriceCart = formatCurrency(totalPriceCart)

  res.render('client/pages/cart/index', {
    titlePage: 'Giỏ hàng',
    cart: cart,
  })
}

// [POST] cart/add/productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId
  const quantity = parseInt(req.body.quantity)
  const cartId = req.cookies.cartId

  const cart = await Cart.findOne({ _id: cartId })

  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  )
  if (existProductInCart) {
    const quantityNew = quantity + existProductInCart.quantity

    await Cart.updateOne(
      { _id: cartId, 'products.product_id': productId },
      { $set: { 'products.$.quantity': quantityNew } }
    )
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    }

    await Cart.updateOne({ _id: cartId }, { $push: { products: objectCart } })
  }

  req.flash('success', 'Bạn thêm sản phẩm vào giỏ hàng thành công.')
  res.redirect(req.get('Referer') || '/')
}

// [GET] cart/delete/productId
module.exports.delete = async (req, res) => {
  const productId = req.params.productId
  const cartId = req.cookies.cartId

  await Cart.updateOne(
    {
      _id: cartId,
    },
    { $pull: { products: { product_id: productId } } }
  )

  req.flash('success', 'Đã xóa sản phẩm khỏi giỏ hàng!')
  res.redirect(req.get('Referer') || '/')
}

// [GET] cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId
  const productId = req.params.productId
  const quantity = req.params.quantity

  await Cart.updateOne(
    { _id: cartId, 'products.product_id': productId },
    { $set: { 'products.$.quantity': quantity } }
  )
  req.flash('success', 'Cập nhật số lượng thành công!')
  res.redirect(req.get('Referer') || '/')
}
