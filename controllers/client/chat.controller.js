// controllers/client/service.controller.js
module.exports.index = async (req, res) => {
  res.render('client/pages/chat/index', {
    titlePage: 'chat',
  })
}
