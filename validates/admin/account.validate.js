module.exports.createPost = (req, res, next) => {
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

module.exports.editPatch = (req, res, next) => {
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

  next()
}
