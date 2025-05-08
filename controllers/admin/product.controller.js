const Product = require('../../modals/product.modal')
const searchHelper = require('../../helper/search')
//[get]admin/product
module.exports.product = async (req, res) => {
  let find = {
    deleted: false,
    // title: 'Đuôi công táo xanh',
  }
  // Bộ lọc
  if (req.query.status) {
    find.status = req.query.status
  }

  // Tìm kiếm
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }
  // phân trang

  let objectPagination = {
    limitItem: 4,
    currentPage: 1,
  }

  if (req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page)
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem

  const countProduct = await Product.countDocuments(find) // đếm số sản phẩm trong database
  const totalPage = Math.ceil(countProduct / objectPagination.limitItem)

  objectPagination.totalPage = totalPage
  // end phân trang
  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)

  res.render('admin/pages/product/index', {
    title: 'Sản phẩm',
    activePage: 'product',
    products: products,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  })
}
