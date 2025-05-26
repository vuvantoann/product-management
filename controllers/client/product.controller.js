const Product = require('../../modals/product.modal')
const { formatCurrency } = require('../../helper/format')
//[get]/product
module.exports.product = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: false,
  }).sort({ position: 'desc' })

  const newProducts = products.map((item) => {
    const priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0)

    return {
      ...item.toObject(),
      price: formatCurrency(item.price),
      priceNew: formatCurrency(priceNew),
    }
  })

  res.render('client/pages/product/index', {
    titlePage: 'Trang sản phẩm',
    products: newProducts,
  })
}

//[get]/product:slug
module.exports.detailProduct = async (req, res) => {
  const slug = req.params.slug
  const product = await Product.findOne({
    slug: slug,
    status: 'active',
    deleted: false,
  })
  const productObj = product.toObject()
  const priceNew = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(0)

  productObj.price = formatCurrency(product.price)
  productObj.priceNew = formatCurrency(priceNew)
  res.render('client/pages/product/detail', {
    titlePage: 'Chi tiết sản phẩm',
    product: productObj,
  })
}
