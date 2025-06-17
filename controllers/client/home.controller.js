const { priceNewProduct } = require('../../helper/product')
const Product = require('../../modals/product.modal')

//[get]/
module.exports.index = async (req, res) => {
  const productFeatured = await Product.find({
    featured: '1',
    status: 'active',
    deleted: false,
  }).limit(8)
  const newProducts = priceNewProduct(productFeatured)

  res.render('client/pages/home/index', {
    titlePage: 'Trang chủ',
    products: newProducts,
  })
}
