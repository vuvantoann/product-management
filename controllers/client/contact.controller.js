// controllers/client/service.controller.js
module.exports.contact = async (req, res) => {
  res.render('client/pages/contact/index', {
    titlePage: 'liên hệ',
  })
}
