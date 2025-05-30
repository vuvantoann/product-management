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

  const categories = await Category.find(find)
  const newCategories = createTreeHelper.tree(categories)
  res.render('admin/pages/category/category-list/index', {
    title: 'Danh mục',
    activePage: 'product',
    activeSub: 'category-list',
    categories: newCategories,
  })
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
