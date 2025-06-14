const Product = require('../../modals/product.modal')
const Category = require('../../modals/category.modal')
const Account = require('../../modals/account.modal')

const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
const systemConfig = require('../../config/system')
const createTreeHelper = require('../../helper/createTree')

//[get]admin/product
module.exports.product = async (req, res) => {
  try {
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
    let sort = {}

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue
    } else {
      sort.position = 'desc'
    }

    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
    for (const product of products) {
      const user = await Account.findOne({
        _id: product.createdBy.account_id,
      })

      if (user) {
        product.accountFullName = user.fullName
      }
    }
    res.render('admin/pages/product/product-list/index', {
      title: 'Sản phẩm',
      activePage: 'product',
      activeSub: 'product-list',
      products: products,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'không lấy được sản phẩm' })
  }
}

//[patch]admin/product/change-status/:status/:id
module.exports.changeProductStatus = async (req, res) => {
  try {
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({ _id: id }, { status: status })
    req.flash('success', 'Bạn đã cập nhật trạng thái sản phẩm thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Cập nhật trạng thái bại' })
  }
}
//[patch]admin/product/change-multi
module.exports.changeMultipleStates = async (req, res) => {
  try {
    const type = req.body.type
    const ids = req.body.ids
    const arrayIds = ids.split(',')
    switch (type) {
      case 'active':
        await Product.updateMany(
          { _id: { $in: arrayIds } },
          { status: 'active' }
        )
        req.flash(
          'success',
          `Bạn đã cập nhật thành công trạng thái active của ${arrayIds.length} sản phẩm`
        )
        break
      case 'inactive':
        await Product.updateMany(
          { _id: { $in: arrayIds } },
          { status: 'inactive' }
        )
        req.flash(
          'success',
          `Bạn đã cập nhật thành công trạng thái inactive của ${arrayIds.length} sản phẩm`
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
        req.flash(
          'success',
          `Bạn đã xóa thành công  ${arrayIds.length} sản phẩm`
        )
        break
      case 'change-position':
        for (let item of arrayIds) {
          let [id, position] = item.split('-')
          position = parseInt(position)
          await Product.updateOne({ _id: id }, { position: parseInt(position) })
        }
        req.flash(
          'success',
          `Bạn đã thay đổi vị trí thành công của ${arrayIds.length} sản phẩm`
        )
        break
      default:
        break
    }

    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'thay đổi sản phẩm thất bại' })
  }
}

// xóa sản phẩm
module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id
    // await Product.deleteOne({ _id: id })
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
    req.flash('success', `Bạn đã xóa sản phẩm thành công`)
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Xóa sản phẩm thất bại' })
  }
}

//[get]admin/product/create-product
module.exports.createProduct = async (req, res) => {
  let find = {
    deleted: false,
  }

  const categories = await Category.find(find)
  const newCategories = createTreeHelper.tree(categories)
  res.render('admin/pages/product/add-product/create', {
    title: 'Thêm mới sản phẩm',
    activePage: 'product',
    activeSub: 'add-product',
    categories: newCategories,
  })
}

//[post]admin/product/create-product
module.exports.createProductPost = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if (req.body.position === '') {
      const countProduct = await Product.countDocuments()
      req.body.position = countProduct + 1
    } else {
      req.body.position = parseInt(req.body.position)
    }
    req.body.createdBy = {
      account_id: res.locals.user._id,
    }
    const newProduct = new Product(req.body)
    await newProduct.save()

    res.redirect(`${systemConfig.prefixAdmin}/product`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Tạo sản phẩm thất bại' })
  }
}

//[get]admin/product/edit-product/id
module.exports.editProduct = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    }

    const categories = await Category.find({
      deleted: false,
    })
    const newCategories = createTreeHelper.tree(categories)
    const product = await Product.findOne(find)
    res.render('admin/pages/product/edit-product/edit', {
      title: 'Chỉnh sửa sản phẩm',
      activePage: 'product',
      activeSub: 'product-list',
      product: product,
      categories: newCategories,
    })
  } catch (error) {
    req.flash('error', `Sản phẩm này không tồn tại`)

    res.redirect(`${systemConfig.prefixAdmin}/product`)
  }
}

//[patch]admin/product/edit-product/:id
module.exports.editProductPatch = async (req, res) => {
  try {
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    // if (req.file) req.body.thumbnail = `/uploads/${req.file.filename}`

    await Product.updateOne({ _id: id }, req.body)
    req.flash('success', 'Bạn đã chỉnh sửa sản phẩm thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Chỉnh sửa sản phẩm thất bại' })
  }
}

//[get]admin/product/detail-product/id
module.exports.detailProduct = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    }
    const product = await Product.findOne(find)
    console.log(product)
    res.render('admin/pages/product/detail-product/detail', {
      title: 'Chi tiết sản phẩm',
      activePage: 'product',
      activeSub: 'product-list',
      product: product,
    })
  } catch (error) {
    req.flash('error', `Sản phẩm này không tồn tại`)

    res.redirect(`${systemConfig.prefixAdmin}/product`)
  }
}
