const Product = require('../../modals/product.modal')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
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
  const countProduct = await Product.countDocuments(find) // đếm số sản phẩm trong database
  let objectPagination = paginationHelper(
    {
      limitItem: 4,
      currentPage: 1,
    },
    req.query,
    countProduct
  )

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

//[patch]admin/product/change-status/:status/:id
module.exports.changeProductStatus = async (req, res) => {
  const status = req.params.status
  const id = req.params.id

  await Product.updateOne({ _id: id }, { status: status })

  res.redirect(req.get('Referer') || '/')
}
//[patch]admin/product/change-multi
module.exports.changeMultipleStates = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids
  console.log(req.body)
  const arrayIds = ids.split(',')
  switch (type) {
    case 'active':
      await Product.updateMany({ _id: { $in: arrayIds } }, { status: 'active' })
      break
    case 'inactive':
      await Product.updateMany(
        { _id: { $in: arrayIds } },
        { status: 'inactive' }
      )
      break
    case 'delete-all':
      await Product.updateMany(
        { _id: { $in: arrayIds } },
        { deleted: true, deleteAt: new Date() }
      )
      break
    default:
      break
  }

  res.redirect(req.get('Referer') || '/')
}

// xóa sản phẩm
module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id
  // await Product.deleteOne({ _id: id })
  await Product.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() })
  res.redirect(req.get('Referer') || '/')
}
