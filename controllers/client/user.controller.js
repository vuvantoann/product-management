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
