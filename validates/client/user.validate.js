module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', `Bạn cần nhập đầy đủ tên`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  if (!req.body.email) {
    req.flash('error', `Bạn cần nhập email`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  if (!req.body.password) {
    req.flash('error', `Bạn cần nhập mật khẩu`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  next()
}

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', `Bạn cần nhập email`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  if (!req.body.password) {
    req.flash('error', `Bạn cần nhập mật khẩu`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  next()
}

module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', `Bạn cần nhập email`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  next()
}

module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash('error', `vui lòng nhập mật khẩu`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  if (!req.body.confirmPassword) {
    req.flash('error', `vui lòng xác nhập mật khẩu`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  if (req.body.confirmPassword !== req.body.password) {
    req.flash('error', `Mật khẩu không khớp`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  next()
}
