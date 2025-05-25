const Product = require('../../modals/product.modal')
//[get]/product
module.exports.product = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: 'false',
  }).sort({ position: 'desc' })

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0)
    return item
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
    deleted: 'false',
  })
  const productObj = product.toObject()
  productObj.priceNew = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(0)

  res.render('client/pages/product/detail', {
    titlePage: 'Chi tiết sản phẩm',
    product: productObj,
  })
}
