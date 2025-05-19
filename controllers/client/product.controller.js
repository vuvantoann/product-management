const Product = require('../../modals/product.modal')
//[get]/product
module.exports.product = async (req, res) => {
  const products = await Product.find({
    status: 'active',
    deleted: 'false',
  }).sort({ position: 'desc' })
  res.render('client/pages/product/index', {
    titlePage: 'Trang sản phẩm',
    products: products,
  })
}
