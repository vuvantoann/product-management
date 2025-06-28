const Product = require('../../modals/product.modal')
const Category = require('../../modals/category.modal')
const Account = require('../../modals/account.modal')

async function getStatistic(Model) {
  const [total, active, inactive] = await Promise.all([
    Model.countDocuments({ deleted: false }),
    Model.countDocuments({ deleted: false, status: 'active' }),
    Model.countDocuments({ deleted: false, status: 'inactive' }),
  ])
  return { total, active, inactive }
}

module.exports.dashboard = async (req, res) => {
  const [product, category, account] = await Promise.all([
    getStatistic(Product),
    getStatistic(Category),
    getStatistic(Account),
  ])

  const statistic = {
    product,
    category,
    account,
    user: { total: 0, active: 0, inactive: 0 }, // placeholder nếu chưa xử lý user
  }

  res.render('admin/pages/dashboard/index', {
    title: 'Trang chủ',
    activePage: 'dashboard',
    statistic,
  })
}
