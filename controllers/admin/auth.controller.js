const Account = require('../../modals/account.modal')
const systemConfig = require('../../config/system')
const md5 = require('md5')

//[get]admin/auth/login
module.exports.login = async (req, res) => {
  try {
    res.render('admin/pages/auth/login/index', {
      title: 'Đăng nhập',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi trang' })
  }
}
//[post]]admin/auth/login
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email
    const password = md5(req.body.password)
    const user = await Account.findOne({
      email: email,
      deleted: false,
    })
    if (!user) {
      req.flash('error', `Email không tồn tại`)
      res.redirect(req.get('Referer') || '/')
      return
    }
    if (password != user.password) {
      req.flash('error', `Sai mật khẩu`)
      res.redirect(req.get('Referer') || '/')
      return
    }

    if (user.status == 'inactive') {
      req.flash('error', `Tài khoản đã bị khóa `)
      res.redirect(req.get('Referer') || '/')
      return
    }
    res.cookie('token', user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi trang' })
  }
}

//[get]admin/auth/login
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie('token')
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi trang' })
  }
}
