const Product = require('../../modals/product.modal')
const searchHelper = require('../../helper/search')
//[get]admin/product
module.exports.product = async (req, res) => {
  let find = {
    deleted: false,
    // title: 'Đuôi công táo xanh',
  }

  if (req.query.status) {
    find.status = req.query.status
  }
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }

  const products = await Product.find(find)
  res.render('admin/pages/product/index', {
    title: 'Sản phẩm',
    activePage: 'product',
    products: products,
    keyword: objectSearch.keyword,
  })
}
