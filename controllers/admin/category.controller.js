const Category = require('../../modals/category.modal')
const searchHelper = require('../../helper/search')
const paginationHelper = require('../../helper/pagination')
const systemConfig = require('../../config/system')
const createTreeHelper = require('../../helper/createTree')

// [GET] admin/category
module.exports.category = async (req, res) => {
  try {
    let find = { deleted: false }

    // Xử lý logic tìm kiếm danh mục
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
      find.title = objectSearch.regex
    }

    // Xử lý phần phân trang danh mục
    const countCategory = await Category.countDocuments(find)
    const objectPagination = paginationHelper(
      { limitItem: 10, currentPage: 1 },
      req.query,
      countCategory
    )

    // Lấy dữ liệu danh mục
    const categories = await Category.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .lean()

    const newCategories = createTreeHelper.tree(categories)

    res.render('admin/pages/category/category-list/index', {
      title: 'Danh mục',
      activePage: 'product',
      activeSub: 'category-list',
      categories: newCategories,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    console.error('Lỗi [GET] /category:', error)
    res.status(500).json({ error: 'Không thể tải danh mục' })
  }
}

// [PATCH] admin/category/change-status/:status/:id
module.exports.changeCategoryStatus = async (req, res) => {
  try {
    const { status, id } = req.params
    if (!id || !status) {
      req.flash('error', 'Thiếu dữ liệu để cập nhật trạng thái.')
      return res.redirect(req.get('Referer') || '/')
    }

    await Category.updateOne({ _id: id }, { status })
    req.flash('success', 'Bạn đã cập nhật trạng thái danh mục thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [PATCH] /category/change-status:', error)
    res.status(500).json({ error: 'Cập nhật trạng thái thất bại' })
  }
}

// [PATCH] admin/category/change-multi
module.exports.changeMultipleStates = async (req, res) => {
  try {
    const { type, ids } = req.body
    if (!type || !ids) {
      req.flash('error', 'Thiếu dữ liệu để thực hiện thao tác.')
      return res.redirect(req.get('Referer') || '/')
    }

    const arrayIds = ids.split(',')
    switch (type) {
      case 'active':
        await Category.updateMany(
          { _id: { $in: arrayIds } },
          { status: 'active' }
        )
        req.flash(
          'success',
          `Đã cập nhật trạng thái active cho ${arrayIds.length} danh mục`
        )
        break

      case 'inactive':
        await Category.updateMany(
          { _id: { $in: arrayIds } },
          { status: 'inactive' }
        )
        req.flash(
          'success',
          `Đã cập nhật trạng thái inactive cho ${arrayIds.length} danh mục`
        )
        break

      case 'delete-all':
        await Category.updateMany(
          { _id: { $in: arrayIds } },
          { deleted: true, deleteAt: new Date() }
        )
        req.flash('success', `Đã xóa ${arrayIds.length} danh mục`)
        break

      case 'change-position':
        for (const item of arrayIds) {
          const [id, position] = item.split('-')
          if (id && position) {
            await Category.updateOne(
              { _id: id },
              { position: parseInt(position) }
            )
          }
        }
        req.flash(
          'success',
          `Đã thay đổi vị trí cho ${arrayIds.length} danh mục`
        )
        break

      default:
        req.flash('error', 'Hành động không hợp lệ.')
        break
    }

    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [PATCH] /category/change-multi:', error)
    res.status(500).json({ error: 'Cập nhật hàng loạt thất bại' })
  }
}

// [DELETE] admin/category/delete/:id
module.exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id
    if (!id) {
      req.flash('error', 'Không tìm thấy danh mục để xóa.')
      return res.redirect(req.get('Referer') || '/')
    }

    await Category.updateOne(
      { _id: id },
      { deleted: true, deleteAt: new Date() }
    )
    req.flash('success', 'Bạn đã xóa danh mục thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [DELETE] /category/delete:', error)
    res.status(500).json({ error: 'Xóa danh mục thất bại' })
  }
}

// [GET] admin/category/create
module.exports.createCategory = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false }).lean()
    const newCategories = createTreeHelper.tree(categories)
    res.render('admin/pages/category/add-category/create', {
      title: 'Tạo mới danh mục',
      activePage: 'product',
      activeSub: 'category-list',
      categories: newCategories,
    })
  } catch (error) {
    console.error('Lỗi [GET] /category/create:', error)
    res.status(500).json({ error: 'Không thể tải trang tạo danh mục' })
  }
}

// [POST] admin/category/create
module.exports.createCategoryPost = async (req, res) => {
  try {
    if (!req.body.title) {
      req.flash('error', 'Tên danh mục không được để trống.')
      return res.redirect(req.get('Referer') || '/')
    }

    if (req.body.position === '' || isNaN(req.body.position)) {
      const countCategory = await Category.countDocuments()
      req.body.position = countCategory + 1
    } else {
      req.body.position = parseInt(req.body.position)
    }

    const newCategory = new Category(req.body)
    await newCategory.save()

    req.flash('success', 'Tạo danh mục thành công.')
    res.redirect(`${systemConfig.prefixAdmin}/category`)
  } catch (error) {
    console.error('Lỗi [POST] /category/create:', error)
    res.status(500).json({ error: 'Tạo danh mục thất bại' })
  }
}

// [GET] admin/category/edit/:id
module.exports.editCategory = async (req, res) => {
  try {
    const id = req.params.id
    const category = await Category.findOne({ _id: id, deleted: false }).lean()

    if (!category) {
      req.flash('error', 'Danh mục không tồn tại')
      return res.redirect(`${systemConfig.prefixAdmin}/category`)
    }

    const categories = await Category.find({ deleted: false }).lean()
    const newCategories = createTreeHelper.tree(categories)

    res.render('admin/pages/category/edit-category/edit', {
      title: 'Chỉnh sửa danh mục',
      activePage: 'product',
      activeSub: 'category-list',
      category,
      categories: newCategories,
    })
  } catch (error) {
    console.error('Lỗi [GET] /category/edit:', error)
    req.flash('error', 'Không thể tải trang chỉnh sửa danh mục')
    res.redirect(`${systemConfig.prefixAdmin}/category`)
  }
}

// [PATCH] admin/category/edit/:id
module.exports.editCategoryPatch = async (req, res) => {
  try {
    const id = req.params.id
    if (!id) {
      req.flash('error', 'Không tìm thấy danh mục để chỉnh sửa.')
      return res.redirect(req.get('Referer') || '/')
    }

    if (req.body.position) {
      req.body.position = parseInt(req.body.position)
    }

    await Category.updateOne({ _id: id }, req.body)
    req.flash('success', 'Bạn đã chỉnh sửa danh mục thành công.')
    res.redirect(req.get('Referer') || '/')
  } catch (error) {
    console.error('Lỗi [PATCH] /category/edit:', error)
    res.status(500).json({ error: 'Chỉnh sửa danh mục thất bại' })
  }
}
