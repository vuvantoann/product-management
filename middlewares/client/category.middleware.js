const Category = require('../../modals/category.modal')
const createTreeHelper = require('../../helper/createTree')
module.exports.category = async (req, res, next) => {
  const categories = await Category.find({
    status: 'active',
    deleted: false,
  })
  const newCategories = createTreeHelper.tree(categories)

  res.locals.categories = newCategories
  next()
}
