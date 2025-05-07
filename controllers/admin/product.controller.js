const Product = require('../../modals/product.modal')
//[get]admin/product
module.exports.product = async (req, res) => {
  let find = {
    deleted: false,
    // title: 'Đuôi công táo xanh',
  }

  if (req.query.status) {
    find.status = req.query.status
  }

  let keyword = ''
  if (req.query.keyword) {
    keyword = req.query.keyword
    find.title = keyword
  }

  const products = await Product.find(find)
  res.render('admin/pages/product/index', {
    title: 'Sản phẩm',
    activePage: 'product',
    products: products,
    keyword: keyword,
  })
}
