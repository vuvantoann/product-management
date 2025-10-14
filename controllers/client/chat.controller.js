const Chat = require('../../modals/chat.modal')
const User = require('../../modals/user.modal')

// controllers/client/service.controller.js
module.exports.index = async (req, res) => {
  const userId = res.locals.user._id
  console.log(userId)
  _io.once('connection', (socket) => {
    socket.on('CLIENT_SEND_MESSAGE', async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content,
      })
      await chat.save()
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
