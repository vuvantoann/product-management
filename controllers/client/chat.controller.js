const Chat = require('../../modals/chat.modal')
const User = require('../../modals/user.modal')

const chatSocket = require('../../sockets/client/chat.socket')

// controllers/client/service.controller.js
module.exports.index = async (req, res) => {
  chatSocket(res)

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
