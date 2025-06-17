const Product = require('../../modals/product.modal')
const {
  priceNewProduct,
  priceNewSingleProduct,
} = require('../../helper/product')
//[get]/product
module.exports.product = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: false,
  }).sort({ position: 'desc' })

  const newProducts = priceNewProduct(products)
  res.render('client/pages/product/product-list/index', {
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
  if (!product) return res.status(404).send('Không tìm thấy sản phẩm')

  const productObj = priceNewSingleProduct(product)
  res.render('client/pages/product/product-detail/detail', {
    titlePage: 'Chi tiết sản phẩm',
    product: productObj,
  })
}
