module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash('error', `Bạn cần nhập tiêu đề trước`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  if (req.body.title.length < 8) {
    req.flash('error', `Tiêu đề cần có ít nhất 8 kí tự`)
    res.redirect(req.get('Referer') || '/')
    return
  }

  next()
}
