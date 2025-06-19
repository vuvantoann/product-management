const Product = require('../../modals/product.modal')
const {
  priceNewProduct,
  priceNewSingleProduct,
} = require('../../helper/product')
// [GET]/search
module.exports.search = async (req, res) => {
  const keyword = req.query.keyword
  let newProducts = []
  if (keyword) {
    const regex = new RegExp(keyword, 'i')
    const products = await Product.find({
      title: regex,
      status: 'active',
      deleted: false,
    })
    newProducts = priceNewProduct(products)
  }

  res.render('client/pages/search/index', {
    titlePage: 'Kết quả tìm kiếm',
    keyword: keyword,
    products: newProducts,
  })
}
