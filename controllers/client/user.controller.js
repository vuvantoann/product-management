const User = require('../../modals/user.modal')
const md5 = require('md5')

const generateHelper = require('../../helper/generate')
const Reset = require('../../modals/reset.modal')
const Cart = require('../../modals/cart.modal')
const { cartId } = require('../../middlewares/client/cart.middleware')
const sendMailHelper = require('../../helper/sendMail')
//[GET]/user/register
module.exports.register = async (req, res) => {
  try {
    res.render('client/pages/user/register', {
      titlePage: 'Đăng ký',
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi máy chủ')
  }
}

//[POST]/user/register
module.exports.registerPost = async (req, res) => {
  try {
    const email = req.body.email
    const emailExist = await User.findOne({ email: email })

    if (emailExist) {
      req.flash('error', `Email ${email} đã tồn tại`)
      res.redirect(req.get('Referer') || '/')
      return
    }

    req.body.password = md5(req.body.password)
    const newUser = new User(req.body)
    await newUser.save()

    res.cookie('tokenUser', newUser.tokenUser)
    req.flash('success', 'Bạn đã tạo mới tài khoản thành công.')
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Đăng ký thất bại')
  }
}

//[GET]/user/login
module.exports.login = async (req, res) => {
  try {
    res.render('client/pages/user/login', {
      titlePage: 'Đăng nhập',
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi máy chủ')
  }
}

//[POST]/user/login
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email
    const password = md5(req.body.password)
    const user = await User.findOne({ email: email, deleted: false })

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

    const cart = await Cart.findOne({ user_id: user.id })
    if (cart) {
      res.cookie('cartId', cart.id)
    } else {
      await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id })
    }

    req.flash('success', 'Đăng nhập tài khoản thành công.')
    res.cookie('tokenUser', user.tokenUser)
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Đăng nhập thất bại')
  }
}

//[GET]/user/logout
module.exports.logout = async (req, res) => {
  try {
    res.clearCookie('tokenUser', { path: '/' })
    res.clearCookie('cartId', { path: '/' })
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi máy chủ')
  }
}

//[GET]/user/profile
module.exports.profile = async (req, res) => {
  try {
    res.render('client/pages/user/profile', {
      titlePage: 'Thông tin tài khoản',
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi máy chủ')
  }
}

//[GET]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  try {
    res.render('client/pages/user/password/forgot', {
      titlePage: 'Khôi phục mật khẩu',
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi máy chủ')
  }
}

//[POST]/user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email, deleted: false })

    if (!user) {
      req.flash('error', `Email không tồn tại`)
      res.redirect(req.get('Referer') || '/')
      return
    }

    const otp = generateHelper.generateRandomNumber(8)

    const timeExpire = 5
    const objectForgotPassword = {
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + timeExpire * 60 * 1000),
    }
    const forgotPassword = new Reset(objectForgotPassword)
    await forgotPassword.save()

    //Gửi mã OTP cho khách hàng

    const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    const html = `
          Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b>
          (Sử dụng trong ${timeExpire} phút).<br>
          Vui lòng không chia sẻ mã OTP này với bất kỳ ai.
        `

    sendMailHelper.sendMail(email, subject, html)
    req.flash('success', 'Đã gửi mã otp qua email!')
    res.redirect(`/user/password/otp?email=${email}`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi khi gửi OTP')
  }
}

//[GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {
  try {
    const email = req.query.email
    res.render('client/pages/user/password/otp', {
      titlePage: 'Nhập mã otp',
      email: email,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi máy chủ')
  }
}

//[POST]/user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  try {
    const email = req.body.email
    const otp = req.body.otp

    const result = await Reset.findOne({ email: email, otp: otp })
    if (!result) {
      req.flash('error', `OTP không hợp lệ!`)
      res.redirect(req.get('Referer') || '/')
      return
    }

    const user = await User.findOne({ email: email, deleted: false })
    res.cookie('tokenUser', user.tokenUser)
    res.redirect(`/user/password/reset`)
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi OTP')
  }
}

//[GET]/user/password/reset
module.exports.resetPassword = async (req, res) => {
  try {
    res.render('client/pages/user/password/reset', {
      titlePage: 'Đổi mật khẩu',
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Lỗi máy chủ')
  }
}

//[POST]/user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  try {
    const password = md5(req.body.password)
    const tokenUser = req.cookies.tokenUser
    await User.updateOne({ tokenUser: tokenUser }, { password: password })

    req.flash('success', 'Bạn đã đổi mật khẩu thành công.')
    res.redirect('/')
  } catch (error) {
    console.error(error)
    res.status(500).send('Đổi mật khẩu thất bại')
  }
}
