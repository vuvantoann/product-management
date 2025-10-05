const Account = require('../../modals/account.modal')
const systemConfig = require('../../config/system')
const md5 = require('md5')

// [GET] admin/auth/login
module.exports.login = async (req, res) => {
  try {
    // Nếu đã có token thì chuyển hướng luôn vào dashboard
    if (req.cookies && req.cookies.token) {
      return res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }

    // Render trang đăng nhập
    return res.render('admin/pages/auth/login/index', {
      title: 'Đăng nhập',
    })
  } catch (error) {
    console.error('Lỗi [GET] /auth/login:', error)
    res.status(500).json({ error: 'Lỗi khi tải trang đăng nhập' })
  }
}

// [POST] admin/auth/login
module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      req.flash('error', 'Vui lòng nhập đầy đủ thông tin đăng nhập')
      return res.redirect(req.get('Referer') || '/')
    }

    const user = await Account.findOne({ email, deleted: false })
    if (!user) {
      req.flash('error', `Email không tồn tại`)
      return res.redirect(req.get('Referer') || '/')
    }

    const hashedPassword = md5(password)
    if (hashedPassword !== user.password) {
      req.flash('error', `Sai mật khẩu`)
      return res.redirect(req.get('Referer') || '/')
    }

    if (user.status === 'inactive') {
      req.flash('error', `Tài khoản đã bị khóa`)
      return res.redirect(req.get('Referer') || '/')
    }

    // Nếu mọi thứ hợp lệ → lưu cookie
    res.cookie('token', user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS nếu đang deploy
      sameSite: 'strict',
    })

    res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
  } catch (error) {
    console.error('Lỗi [POST] /auth/login:', error)
    res.status(500).json({ error: 'Lỗi xử lý đăng nhập' })
  }
}

// [GET] admin/auth/logout
module.exports.logout = async (req, res) => {
  try {
    // Xóa cookie token nếu tồn tại
    if (req.cookies && req.cookies.token) {
      res.clearCookie('token')
    }

    res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
  } catch (error) {
    console.error('Lỗi [GET] /auth/logout:', error)
    res.status(500).json({ error: 'Lỗi khi đăng xuất' })
  }
}
