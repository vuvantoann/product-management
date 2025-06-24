const User = require('../../modals/user.modal')
const md5 = require('md5')
//[GET]/user/register
module.exports.register = async (req, res) => {
  res.render('client/pages/user/register', {
    titlePage: 'Đăng ký',
  })
}

//[POST]/user/register
module.exports.registerPost = async (req, res) => {
  const email = req.body.email

  const emailExist = await User.findOne({ email: email })

  if (emailExist) {
    req.flash('error', `Email ${email} đã tồn tại`)
    res.redirect(req.get('Referer') || '/')
  } else {
    req.body.password = md5(req.body.password)

    const newUser = new User(req.body)
    await newUser.save()
    res.cookie('tokenUser', newUser.tokenUser)
    req.flash('success', 'Bạn đã tạo mới tài khoản thành công.')
    res.redirect('/')
  }
}

//[GET]/user/login
module.exports.login = async (req, res) => {
  res.render('client/pages/user/login', {
    titlePage: 'Đăng nhập',
  })
}

//[POST]/user/login
module.exports.loginPost = async (req, res) => {
  console.log(req.body)

  const email = req.body.email
  const password = md5(req.body.password)
  const user = await User.findOne({
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

  if (user.status === 'inactive') {
    req.flash('error', `Tài khoảng đã bị khóa`)
    res.redirect(req.get('Referer') || '/')
    return
  }
  req.flash('success', 'Đăng nhập tài khoản thành công.')
  res.cookie('tokenUser', user.tokenUser)
  res.redirect('/')
}

//[GET]/user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser')
  res.redirect('/')
}
