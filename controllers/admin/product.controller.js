const Product = require('../../modals/product.modal')
const Category = require('../../modals/category.modal')
const Account = require('../../modals/account.modal')

const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
const systemConfig = require('../../config/system')
const createTreeHelper = require('../../helper/createTree')

// [GET] admin/product
module.exports.product = async (req, res) => {
  try {
    const find = { deleted: false }

    // Bộ lọc
    if (req.query.status) find.status = req.query.status

    // Tìm kiếm
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) find.title = objectSearch.regex

    // Phân trang
    const countProduct = await Product.countDocuments(find)
    const objectPagination = paginationHelper(
      { limitItem: 4, currentPage: 1 },
      req.query,
      countProduct
    )

    // Sắp xếp
    const sort =
      req.query.sortKey && req.query.sortValue
        ? { [req.query.sortKey]: req.query.sortValue }
        : { position: 'desc' }

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .lean()

    // Thêm tên người tạo (populate thủ công để giữ hiệu năng)
    const accountIds = products
      .map((p) => p.createdBy?.account_id)
      .filter(Boolean)
    const accounts = await Account.find({ _id: { $in: accountIds } }).lean()
    const accountMap = Object.fromEntries(
      accounts.map((a) => [a._id, a.fullName])
    )

    for (const product of products) {
      product.accountFullName =
        accountMap[product.createdBy?.account_id] || 'N/A'
    }

    res.render('admin/pages/product/product-list/index', {
      title: 'Sản phẩm',
      activePage: 'product',
      activeSub: 'product-list',
      products,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    console.error('Lỗi [GET] /product:', error)
    res.status(500).json({ error: 'Không lấy được danh sách sản phẩm' })
  }
}

// [PATCH] admin/product/change-status/:status/:id
module.exports.changeProductStatus = async (req, res) => {
  try {
    const { status, id } = req.params

    // Validate id
    if (!id || id === 'null') {
      req.flash('error', 'ID sản phẩm không hợp lệ.')
      return res.redirect(req.get('Referer') || '/')
    }

    const updatedBy = {
      account_id: res.locals.user?._id,
      updatedAt: new Date(),
    }

    const result = await Product.updateOne(
      { _id: id },
      { status, $push: { updatedBy } }
    )

    if (result.modifiedCount === 0) {
      req.flash('error', 'Không tìm thấy sản phẩm cần cập nhật.')
      return res.redirect(req.get('Referer') || '/')
    }

    req.flash('success', 'Cập nhật trạng thái sản phẩm thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [PATCH] /change-status:', error)
    req.flash('error', 'Cập nhật trạng thái thất bại.')
    res.redirect(req.get('Referer') || '/')
  }
}

// [PATCH] admin/product/change-multi
module.exports.changeMultipleStates = async (req, res) => {
  try {
    const { type, ids } = req.body
    const arrayIds = ids?.split(',').filter(Boolean)
    if (!arrayIds?.length) {
      req.flash('error', 'Không có sản phẩm nào được chọn.')
      return res.redirect(req.get('Referer') || '/')
    }

    const updatedBy = {
      account_id: res.locals.user._id,
      updatedAt: new Date(),
    }

    switch (type) {
      case 'active':
      case 'inactive':
        await Product.updateMany(
          { _id: { $in: arrayIds } },
          { status: type, $push: { updatedBy } }
        )
        req.flash(
          'success',
          `Đã cập nhật trạng thái ${type} cho ${arrayIds.length} sản phẩm.`
        )
        break

      case 'delete-all':
        await Product.updateMany(
          { _id: { $in: arrayIds } },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user._id,
              deletedAt: new Date(),
            },
          }
        )
        req.flash('success', `Đã xóa ${arrayIds.length} sản phẩm thành công.`)
        break

      case 'change-position':
        for (const item of arrayIds) {
          const [id, position] = item.split('-')
          await Product.updateOne(
            { _id: id },
            { position: parseInt(position), $push: { updatedBy } }
          )
        }
        req.flash('success', `Đã thay đổi vị trí ${arrayIds.length} sản phẩm.`)
        break

      default:
        req.flash('error', 'Loại thay đổi không hợp lệ.')
        break
    }

    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [PATCH] /change-multi:', error)
    res.status(500).json({ error: 'Thay đổi sản phẩm thất bại' })
  }
}

// [DELETE] admin/product/delete/:id
module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user._id,
          deletedAt: new Date(),
        },
      }
    )
    req.flash('success', 'Xóa sản phẩm thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [DELETE] /product:', error)
    res.status(500).json({ error: 'Xóa sản phẩm thất bại' })
  }
}

// [GET] admin/product/create-product
module.exports.createProduct = async (req, res) => {
  try {
    const categories = (await Category.find({ deleted: false }).lean()) || []
    let newCategories = []
    try {
      newCategories = createTreeHelper.tree(categories)
    } catch (err) {
      console.error('Lỗi createTreeHelper:', err)
    }

    res.render('admin/pages/product/add-product/create', {
      title: 'Thêm mới sản phẩm',
      activePage: 'product',
      activeSub: 'add-product',
      categories: newCategories,
    })
  } catch (error) {
    console.error('Lỗi [GET] /create-product:', error)
    res.status(500).json({ error: error.message })
  }
}

// [POST] admin/product/create-product
module.exports.createProductPost = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    const countProduct = await Product.countDocuments()
    req.body.position = req.body.position
      ? parseInt(req.body.position)
      : countProduct + 1

    req.body.createdBy = { account_id: res.locals.user._id }

    const newProduct = new Product(req.body)
    await newProduct.save()

    req.flash('success', 'Thêm sản phẩm thành công.')
    res.redirect(`${systemConfig.prefixAdmin}/product`)
  } catch (error) {
    console.error('Lỗi [POST] /create-product:', error)
    res.status(500).json({ error: 'Tạo sản phẩm thất bại' })
  }
}

// [GET] admin/product/edit-product/:id
module.exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params

    const [categories, product] = await Promise.all([
      Category.find({ deleted: false }).lean(),
      Product.findOne({ _id: id, deleted: false }).lean(),
    ])

    if (!product) {
      req.flash('error', 'Sản phẩm này không tồn tại.')
      return res.redirect(`${systemConfig.prefixAdmin}/product`)
    }

    const newCategories = createTreeHelper.tree(categories)

    res.render('admin/pages/product/edit-product/edit', {
      title: 'Chỉnh sửa sản phẩm',
      activePage: 'product',
      activeSub: 'product-list',
      product,
      categories: newCategories,
    })
  } catch (error) {
    console.error('Lỗi [GET] /edit-product:', error)
    req.flash('error', 'Không tải được trang chỉnh sửa sản phẩm.')
    res.redirect(`${systemConfig.prefixAdmin}/product`)
  }
}

// [PATCH] admin/product/edit-product/:id
module.exports.editProductPatch = async (req, res) => {
  try {
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    const updatedBy = {
      account_id: res.locals.user._id,
      updatedAt: new Date(),
    }

    await Product.updateOne({ _id: id }, { ...req.body, $push: { updatedBy } })

    req.flash('success', 'Chỉnh sửa sản phẩm thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [PATCH] /edit-product:', error)
    res.status(500).json({ error: 'Chỉnh sửa sản phẩm thất bại' })
  }
}

// [GET] admin/product/detail-product/:id
module.exports.detailProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id, deleted: false }).lean()

    if (!product) {
      req.flash('error', 'Sản phẩm này không tồn tại.')
      return res.redirect(`${systemConfig.prefixAdmin}/product`)
    }

    res.render('admin/pages/product/detail-product/detail', {
      title: 'Chi tiết sản phẩm',
      activePage: 'product',
      activeSub: 'product-list',
      product,
    })
  } catch (error) {
    console.error('Lỗi [GET] /detail-product:', error)
    req.flash('error', 'Không thể tải chi tiết sản phẩm.')
    res.redirect(`${systemConfig.prefixAdmin}/product`)
  }
}
