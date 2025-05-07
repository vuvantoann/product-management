//[get]admin/dashboard

module.exports.dashboard = (req, res) => {
  res.render('admin/pages/dashboard/index', {
    title: 'Trang chủ',
    activePage: 'dashboard',
  })
}
