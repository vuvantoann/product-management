const Category = require('../../modals/category.modal')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
const systemConfig = require('../../config/system')
const createTreeHelper = require('../../helper/createTree')

//[get]admin/category
module.exports.category = async (req, res) => {
  let find = {
    deleted: false,
  }

  // sử lý logic phần tìm kiếm danh mục
  const objectSearch = searchHelper(req.query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }
  // kết thúc sử lý logic phần tìm kiếm danh mục

  // sử lý phần phân trang cho danh mục sản phẩm
  const countCategory = await Category.countDocuments(find)
  let objectPagination = paginationHelper(
    {
      limitItem: 10,
      currentPage: 1,
    },
    req.query,
    countCategory
  )

  // kết thúc sử lý phân trang cho danh mục
  const categories = await Category.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)
  const newCategories = createTreeHelper.tree(categories)
  res.render('admin/pages/category/category-list/index', {
    title: 'Danh mục',
    activePage: 'product',
    activeSub: 'category-list',
    categories: newCategories,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  })
}

//[patch]admin/category/change-status/:status/:id
module.exports.changeCategoryStatus = async (req, res) => {
  try {
    const status = req.params.status
    const id = req.params.id

    await Category.updateOne({ _id: id }, { status: status })
    req.flash('success', 'Bạn đã cập nhật trạng thái danh mục thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Cập nhật trạng thái bại' })
  }
}

//[patch]admin/category/change-multi
module.exports.changeMultipleStates = async (req, res) => {
  try {
    const type = req.body.type
    const ids = req.body.ids
    const arrayIds = ids.split(',')
    switch (type) {
      case 'active':
        await Category.updateMany(
          { _id: { $in: arrayIds } },
          { status: 'active' }
        )
        req.flash(
          'success',
          `Bạn đã cập nhật thành công trạng thái của ${arrayIds.length} danh mục`
        )
        break
      case 'inactive':
        await Category.updateMany(
          { _id: { $in: arrayIds } },
          { status: 'inactive' }
        )
        req.flash(
          'success',
          `Bạn đã cập nhật thành công trạng thái inactive của ${arrayIds.length} danh mục`
        )
        break
      case 'delete-all':
        await Category.updateMany(
          { _id: { $in: arrayIds } },
          { deleted: true, deleteAt: new Date() }
        )
        req.flash(
          'success',
          `Bạn đã xóa thành công  ${arrayIds.length} danh mục`
        )
        break
      case 'change-position':
        for (let item of arrayIds) {
          let [id, position] = item.split('-')
          position = parseInt(position)
          await Category.updateOne(
            { _id: id },
            { position: parseInt(position) }
          )
        }
        req.flash(
          'success',
          `Bạn đã thay đổi vị trí thành công của ${arrayIds.length} danh mục`
        )
        break
      default:
        break
    }

    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: ' thất bại' })
  }
}

// xóa sản phẩm
module.exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id
    // await Product.deleteOne({ _id: id })
    await Category.updateOne(
      { _id: id },
      { deleted: true, deleteAt: new Date() }
    )
    req.flash('success', `Bạn đã xóa danh mục thành công`)
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Xóa sản  bại' })
  }
}

//[get]admin/category/create
module.exports.createCategory = async (req, res) => {
  let find = {
    deleted: false,
  }

  const categories = await Category.find(find)
  const newCategories = createTreeHelper.tree(categories)
  res.render('admin/pages/category/add-category/create', {
    title: 'Tạo mới danh mục',
    activePage: 'product',
    activeSub: 'category-list',
    categories: newCategories,
  })
}

//[post]admin/category/create
module.exports.createCategoryPost = async (req, res) => {
  try {
    if (req.body.position === '') {
      const countCategory = await Category.countDocuments()
      req.body.position = countCategory + 1
    } else {
      req.body.position = parseInt(req.body.position)
    }

    const newCategory = new Category(req.body)
    await newCategory.save()

    res.redirect(`${systemConfig.prefixAdmin}/category`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Tạo danh mục thất bại' })
  }
}

//[get]admin/category/edit/id
module.exports.editCategory = async (req, res) => {
  try {
    let find = {
      deleted: false,
      _id: req.params.id,
    }
    const category = await Category.findOne(find)
    const categories = await Category.find({
      deleted: false,
    })
    const newCategories = createTreeHelper.tree(categories)
    res.render('admin/pages/category/edit-category/edit', {
      title: 'Chỉnh sửa danh mục',
      activePage: 'product',
      activeSub: 'category-list',
      category: category,
      categories: newCategories,
    })
  } catch (error) {
    req.flash('error', `danh mục này không tồn tại`)

    res.redirect(`${systemConfig.prefixAdmin}/category`)
  }
}

//[patch]admin/category/edit/:id
module.exports.editCategoryPatch = async (req, res) => {
  try {
    const id = req.params.id
    req.body.position = parseInt(req.body.position)

    // if (req.file) req.body.thumbnail = `/uploads/${req.file.filename}`

    await Category.updateOne({ _id: id }, req.body)
    req.flash('success', 'Bạn đã chỉnh sửa danh mục thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Chỉnh sửa danh mục thất bại' })
  }
}
