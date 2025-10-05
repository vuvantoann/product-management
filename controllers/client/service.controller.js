// controllers/client/service.controller.js
module.exports.service = async (req, res) => {
  res.render('client/pages/service/index', {
    titlePage: 'Dịch vụ',
  })
}
