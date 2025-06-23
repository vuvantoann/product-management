const Cart = require('../../modals/cart.modal')
const Product = require('../../modals/product.modal')
const Order = require('../../modals/order.modal')
const {
  priceNewProduct,
  priceNewSingleProduct,
} = require('../../helper/product')
const { formatCurrency } = require('../../helper/format')

//[GET]/checkout
module.exports.checkout = async (req, res) => {
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

  res.render('client/pages/checkout/index', {
    titlePage: 'Thanh toán',
    cart: cart,
  })
}

//[POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId
  const userInfo = req.body
  const cart = await Cart.findOne({ _id: req.cookies.cartId })
  const products = []

  for (const product of cart.products) {
    const productObject = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    }
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select(' price discountPercentage ')

    productObject.price = productInfo.price
    productObject.discountPercentage = productInfo.discountPercentage

    products.push(productObject)
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  }

  const order = new Order(orderInfo)
  await order.save()

  await Cart.updateOne(
    { _id: cartId },
    {
      products: [],
    }
  )

  res.redirect(`/checkout/success/${order.id}`)
}

//[GET]/checkout/success/:orderId
module.exports.success = async (req, res) => {
  console.log(req.params.orderId)

  const order = await Order.findOne({
    _id: req.params.orderId,
  })

  for (const product of order.products) {
    const productId = product.product_id
    const productInfo = await Product.findOne({ _id: productId }).select(
      'title thumbnail  price discountPercentage '
    )
    const newProductInfo = priceNewSingleProduct(productInfo)

    product.productInfo = newProductInfo
    product.totalPriceRaw = newProductInfo.priceNewRaw * product.quantity

    product.totalPrice = formatCurrency(product.totalPriceRaw)
  }
  const totalPriceOrder = order.products.reduce(
    (sum, item) => sum + item.totalPriceRaw,
    0
  )

  order.totalPriceOrder = formatCurrency(totalPriceOrder)

  res.render('client/pages/checkout/success', {
    titlePage: 'Đặt hàng thành công',
    order: order,
  })
}
