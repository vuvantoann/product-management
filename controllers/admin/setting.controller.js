//[get]admin/setting

module.exports.setting = (req, res) => {
  res.render('admin/pages/setting/index', {
    title: 'Trang cài đặt',
    activePage: 'setting',
  })
}
