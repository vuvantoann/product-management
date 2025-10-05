const Cart = require('../../modals/cart.modal')
const Product = require('../../modals/product.modal')
const Order = require('../../modals/order.modal')
const {
  priceNewProduct,
  priceNewSingleProduct,
} = require('../../helper/product')
const { formatCurrency } = require('../../helper/format')

// [GET] /checkout
module.exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.cookies.cartId })
    if (!cart) {
      req.flash('error', 'Không tìm thấy giỏ hàng!')
      return res.redirect('/')
    }

    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productId = item.product_id
        const productInfo = await Product.findOne({ _id: productId }).select(
          'title thumbnail slug price discountPercentage stock'
        )

        if (!productInfo) continue

        const newProductInfo = priceNewSingleProduct(productInfo)

        item.productInfo = newProductInfo
        item.totalPriceRaw = newProductInfo.priceNewRaw * item.quantity
        item.totalPrice = formatCurrency(item.totalPriceRaw)
      }
    }

    const totalPriceCart = cart.products.reduce(
      (sum, item) => sum + (item.totalPriceRaw || 0),
      0
    )

    cart.totalPriceCart = formatCurrency(totalPriceCart)

    res.render('client/pages/checkout/index', {
      titlePage: 'Thanh toán',
      cart: cart,
    })
  } catch (error) {
    console.error('Lỗi khi tải trang thanh toán:', error)
    res.status(500).send('Lỗi máy chủ khi tải trang thanh toán')
  }
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  try {
    const cartId = req.cookies.cartId
    const userInfo = req.body
    const cart = await Cart.findOne({ _id: cartId })
    if (!cart || cart.products.length === 0) {
      req.flash('error', 'Giỏ hàng trống!')
      return res.redirect('/')
    }

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
      }).select('price discountPercentage')

      if (!productInfo) continue

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

    await Cart.updateOne({ _id: cartId }, { products: [] })

    res.redirect(`/checkout/success/${order.id}`)
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error)
    res.status(500).send('Lỗi máy chủ khi tạo đơn hàng')
  }
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId })
    if (!order) {
      req.flash('error', 'Đơn hàng không tồn tại!')
      return res.redirect('/')
    }

    for (const product of order.products) {
      const productId = product.product_id
      const productInfo = await Product.findOne({ _id: productId }).select(
        'title thumbnail price discountPercentage'
      )
      if (!productInfo) continue

      const newProductInfo = priceNewSingleProduct(productInfo)

      product.productInfo = newProductInfo
      product.totalPriceRaw = newProductInfo.priceNewRaw * product.quantity
      product.totalPrice = formatCurrency(product.totalPriceRaw)
    }

    const totalPriceOrder = order.products.reduce(
      (sum, item) => sum + (item.totalPriceRaw || 0),
      0
    )

    order.totalPriceOrder = formatCurrency(totalPriceOrder)

    res.render('client/pages/checkout/success', {
      titlePage: 'Đặt hàng thành công',
      order: order,
    })
  } catch (error) {
    console.error('Lỗi khi hiển thị đơn hàng thành công:', error)
    res.status(500).send('Lỗi máy chủ khi hiển thị đơn hàng')
  }
}

// [GET] /checkout/buy-now/:productId
module.exports.buyNow = async (req, res) => {
  try {
    const productId = req.params.productId
    const productInfo = await Product.findOne({ _id: productId }).select(
      'title thumbnail price discountPercentage'
    )
    if (!productInfo) {
      req.flash('error', 'Sản phẩm không tồn tại!')
      return res.redirect('/')
    }

    const newProductInfo = priceNewSingleProduct(productInfo)

    res.render('client/pages/checkout/index', {
      titlePage: 'Thanh toán',
      product: newProductInfo,
    })
  } catch (error) {
    console.error('Lỗi khi mua ngay sản phẩm:', error)
    res.status(500).send('Lỗi máy chủ khi mua sản phẩm')
  }
}

// [POST] /checkout/order-buy-now
module.exports.orderBuyNow = async (req, res) => {
  try {
    const { product_id, fullName, email, phone, address } = req.body
    const userInfo = { fullName, email, phone, address }

    const product = await Product.findById(product_id).select(
      'price discountPercentage'
    )
    if (!product) {
      req.flash('error', 'Sản phẩm không tồn tại!')
      return res.redirect('/')
    }

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
  } catch (error) {
    console.error('Lỗi khi đặt hàng mua ngay:', error)
    res.status(500).send('Lỗi máy chủ khi đặt hàng mua ngay')
  }
}
