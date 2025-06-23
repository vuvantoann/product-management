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

//[GET]/checkout/buy-now/:productId
module.exports.buyNow = async (req, res) => {
  const productId = req.params.productId
  const productInfo = await Product.findOne({ _id: productId }).select(
    'title thumbnail  price discountPercentage '
  )
  const newProductInfo = priceNewSingleProduct(productInfo)

  res.render('client/pages/checkout/index', {
    titlePage: 'Thanh toán',
    product: newProductInfo,
  })
}

//[POST]/checkout/order-buy-now

module.exports.orderBuyNow = async (req, res) => {
  const { product_id, fullName, email, phone, address } = req.body
  const userInfo = { fullName, email, phone, address }

  const product = await Product.findById(product_id).select(
    'price discountPercentage'
  )
  if (!product) return res.redirect('/')

  const order = new Order({
    userInfo,
    products: [
      {
        product_id,
        price: product.price,
        discountPercentage: product.discountPercentage,
        quantity: 1,
      },
    ],
  })

  await order.save()
  res.redirect(`/checkout/success/${order.id}`)
}
