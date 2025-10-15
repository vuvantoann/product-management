const Chat = require('../../modals/chat.modal')
const User = require('../../modals/user.modal')

// controllers/client/service.controller.js
module.exports.index = async (req, res) => {
  const userId = res.locals.user._id
  const fullName = res.locals.user.fullName

  console.log(userId)
  _io.once('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content,
      })
      await chat.save()

      const time = chat.createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })

      _io.emit('SERVER_RETURN_MESSAGE', {
        userId: userId,
        fullName: fullName,
        content: content,
        time: time,
      })
    })

    socket.on('CLIENT_SEND_TYPING', (type) => {
      socket.broadcast.emit('SERVER_RETURN_TYPING', {
        userId: userId,
        fullName: fullName,
        type: type,
      })
    })
  })

  // lấy ra data chat

  const chatsRaw = await Chat.find({ deleted: false })
  const chats = []

  for (let chat of chatsRaw) {
    const infoUser = await User.findOne({ _id: chat.user_id }).select(
      'fullName'
    )
    const chatObj = chat.toObject()

    chatObj.fullName = infoUser ? infoUser.fullName : 'Unknown'
    chatObj.time = chat.createdAt.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }) // 👉 ra "11:26 AM"

    chats.push(chatObj)
  }

  res.render('client/pages/chat/index', {
    titlePage: 'Group Chat',
    chats,
  })
}
