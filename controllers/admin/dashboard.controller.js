const Product = require('../../modals/product.modal')
const Category = require('../../modals/category.modal')
const Account = require('../../modals/account.modal')

// Hàm thống kê tổng hợp có xử lý lỗi riêng từng Model
async function getStatistic(Model) {
  try {
    const [total, active, inactive] = await Promise.all([
      Model.countDocuments({ deleted: false }),
      Model.countDocuments({ deleted: false, status: 'active' }),
      Model.countDocuments({ deleted: false, status: 'inactive' }),
    ])
    return { total, active, inactive }
  } catch (error) {
    console.error(`Lỗi khi thống kê ${Model.modelName}:`, error)
    return { total: 0, active: 0, inactive: 0 } // fallback an toàn
  }
}

// [GET] admin/dashboard
module.exports.dashboard = async (req, res) => {
  try {
    // Chạy song song tất cả thống kê
    const [product, category, account] = await Promise.all([
      getStatistic(Product),
      getStatistic(Category),
      getStatistic(Account),
    ])

    const statistic = {
      product,
      category,
      account,
      user: { total: 0, active: 0, inactive: 0 }, // placeholder nếu chưa có model User
    }

    res.render('admin/pages/dashboard/index', {
      title: 'Trang chủ',
      activePage: 'dashboard',
      statistic,
    })
  } catch (error) {
    console.error('Lỗi [GET] /dashboard:', error)
    res.status(500).json({ error: 'Không thể tải trang thống kê' })
  }
}
