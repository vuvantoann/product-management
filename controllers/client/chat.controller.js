// controllers/client/service.controller.js
module.exports.index = async (req, res) => {
  _io.on('connection', (socket) => {
    console.log('user - id', socket.id)
  })

  res.render('client/pages/chat/index', {
    titlePage: 'chat',
  })
}
