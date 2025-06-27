const User = require('../../modals/user.modal')
const md5 = require('md5')

const generateHelper = require('../../helper/generate')
const Reset = require('../../modals/reset.modal')
const Cart = require('../../modals/cart.modal')
const { cartId } = require('../../middlewares/client/cart.middleware')

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

  const cart = await Cart.findOne({
    user_id: user.id,
  })

  if (cart) {
    res.cookie('cartId', cart.id)
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartId,
      },
      {
        user_id: user.id,
      }
    )
  }

  req.flash('success', 'Đăng nhập tài khoản thành công.')
  res.cookie('tokenUser', user.tokenUser)
  res.redirect('/')
}

//[GET]/user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser', { path: '/' })
  res.clearCookie('cartId', { path: '/' })
  res.redirect('/')
}

//[GET]/user/profile
module.exports.profile = async (req, res) => {
  res.render('client/pages/user/profile', {
    titlePage: 'Thông tin tài khoản',
  })
}

//[GET]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render('client/pages/user/password/forgot', {
    titlePage: 'Khôi phục mật khẩu',
  })
}

//[POST]/user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email

  const user = await User.findOne({
    email: email,
    deleted: false,
  })

  if (!user) {
    req.flash('error', `Email không  tồn tại`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  // nếu có tồn tại email thì gửi mã OTP qua cho email

  //lưu thông tin email vào mã otp đã tạo vào mongodb trước
  const otp = generateHelper.generateRandomNumber(8)
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  }
  const forgotPassword = new Reset(objectForgotPassword)
  await forgotPassword.save()

  // chuyển sang trang nhập mã otp
  res.redirect(`/user/password/otp?email=${email}`)
}

//[GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email
  res.render('client/pages/user/password/otp', {
    titlePage: 'Nhập mã otp',
    email: email,
  })
}

//[POST]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email
  const otp = req.body.otp

  const result = await Reset.findOne({
    email: email,
    otp: otp,
  })

  if (!result) {
    req.flash('error', `OTP không hợp lệ!`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  const user = await User.findOne({
    email: email,
    deleted: false,
  })

  res.cookie('tokenUser', user.tokenUser)
  res.redirect(`/user/password/reset`)
}

//[GET]/user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render('client/pages/user/password/reset', {
    titlePage: 'Đổi mật khẩu',
  })
}

//[POST]/user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = md5(req.body.password)
  const tokenUser = req.cookies.tokenUser
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: password,
    }
  )

  req.flash('success', 'Bạn đã đổi mật khẩu thành công.')

  res.redirect('/')
}
