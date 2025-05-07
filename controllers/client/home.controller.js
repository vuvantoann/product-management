const Product = require('../../modals/product.modal')
//[get]/
module.exports.index = async (req, res) => {
  const products = await Product.find({
    isItem: true,
  })
  console.log(products)
  res.render('client/pages/home/index', {
    titlePage: 'Trang chủ',
    products: products,
  })
}
